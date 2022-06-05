let service = require("../service");
let response = require("../../responses");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const storage = require("../../../firebase");

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return response.failedWithMessage(
      "username, firstName, lastName, email, and password are required in the req body",
      res
    );
  }
  try {
    const result = await service.signup(firstName, lastName, email, password);
    if (result?.code === 0) {
      return response.successWithMessage(result?.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

// Login user and return JWT as cookie
exports.login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return response.failedWithMessage(
      "email and password are required in req body",
      res
    );
  }
  try {
    const result = await service.login(email, password);
    if (result?.code === 0) {
      res.cookie("jwt", result.data.token); // <--- Adds token to response as a cookie
      return response.success(result.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};

// get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await service.getProfile(userId);
    if (result?.code === 0) {
      return response.success(result.data, res);
    } else if (result?.code === 1) {
      return response.failedWithMessage(result?.data, res);
    } else {
      return response.notAcceptable(res);
    }
  } catch (e) {
    return response.serverError(res);
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", { expires: new Date(0) });
  return response.successWithMessage("Logged out", res);
};

exports.uploadPhoto = async (req, res) => {
  const file = req?.file;
  const userId = req?.user?.id;
  const uniqueFileName = `images/${
    file?.originalname?.split(".")[0]
  }%%${new Date().valueOf()}.${file?.originalname?.split(".")[1]}`;
  try {
    const imageRef = ref(storage, uniqueFileName);
    const metaType = { contentType: file?.mimetype, name: file?.originalname };
    await uploadBytes(imageRef, file?.buffer, metaType)
      .then(async () => {
        let publicUrl = await getDownloadURL(imageRef);
        let result = await service.addImage(publicUrl, userId);
        if (result?.code === 0) {
          return response.success(publicUrl, res);
        } else if (result?.code === 1) {
          return response.failedWithMessage(result?.data, res);
        } else {
          return response.notAcceptable(res);
        }
      })
      .catch((e) => {
        console.error(e);
        return response.failedWithMessage(e.message, res);
      });
  } catch (e) {
    console.error(e);
    return response.serverError(res);
  }
};
