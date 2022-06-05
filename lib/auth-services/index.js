const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("../responses");

const signUser = (user) => {
  const token = jwt.sign(
    {
      // this object will be saved in the token payload
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET, // this will read from the .env file a key named JWT_SECRET and will take the value
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const verifyUser = (req, res, next) => {
  try {
    // take out the jwt we've set in the cookie set or from auth headers coming from client
    const token =
      req?.cookies?.jwt ||
      req?.headers?.authorization?.split(" ")[1] ||
      req?.headers?.Authorization?.split(" ")[1] ||
      null;
    // return error if token is undefined
    if (!token) return response.unauthenticated(res);
    // verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      // return an error if there was an issue verifying the token
      if (err) {
        return response.unauthorized(res);
      } else {
        // set the user data to the req obj using the decoded token payload
        req.user = {
          id: decoded.id,
          email: decoded.email,
          token: token,
        };
        // call the next middleware
        return next();
      }
    });
  } catch (err) {
    console.error(err);
    return response.serverError(res);
  }
};
const hashPassword = (plainTextPassword) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(plainTextPassword, salt);
  return hash;
};

const comparePasswords = (plainTextPassword, hashedPassword) => {
  return bcrypt.compareSync(plainTextPassword, hashedPassword);
};

module.exports = {
  signUser,
  verifyUser,
  hashPassword,
  comparePasswords,
};
