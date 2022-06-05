const models = require("../../../models");
const authService = require("../../auth-services");

exports.login = async (email, password) => {
  try {
    let user = await models.users.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return { code: 1, data: "incorrect credentials" };
    } else {
      let passwordMatch = authService.comparePasswords(password, user.password);
      if (passwordMatch) {
        let token = authService.signUser(user); // <--- Uses the authService to create jwt token
        let { password, updatedAt, createdAt, ...rest } = user.dataValues;
        return { code: 0, data: { ...rest, token } };
      } else {
        return { code: 1, data: "incorrect credentials" };
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.signup = async (firstName, lastName, email, password) => {
  try {
    let [result, created] = await models.users.findOrCreate({
      where: {
        email,
      },
      defaults: {
        first_name: firstName,
        last_name: lastName,
        email,
        password: authService.hashPassword(password),
      },
    });
    if (created) {
      return { code: 0, data: "user created" };
    } else {
      return { code: 1, data: "This user already exists" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.getProfile = async (userId) => {
  try {
    let query = `SELECT 
    first_name, last_name, email, image, createdAt
FROM
    users
WHERE
    id = :userId;`;
    const data = await models.sequelize.query(query, {
      replacements: {
        userId,
      },
      type: models.sequelize.QueryTypes.SELECT,
    });
    if (data) {
      return { code: 0, data: data[0] };
    } else {
      return { code: 1, data: "failed to fetch user profile" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.addImage = async (imgUrl, userId) => {
  try {
    let query = `UPDATE users 
    SET 
        image = :imgUrl
    WHERE
        id = :userId;`;
    const data = await models.sequelize.query(query, {
      replacements: {
        imgUrl,
        userId,
      },
      type: models.sequelize.QueryTypes.UPDATE,
    });
    if (data[1] === 1) {
      return { code: 0, data: "user profile image added" };
    } else {
      return { code: 1, data: "failed to add user profile image" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
