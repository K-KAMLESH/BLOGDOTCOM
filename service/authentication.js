const JWT = require("jsonwebtoken");
const secretKey = "mynameiskmalesh";

const generateToken = (user) => {
  const token = JWT.sign(
    {
      name: user.name,
      email: user.email,
      _id: user._id,
      profileImageURL: user.profileImageURL,
      role: user.role,
      salt: user.salt,
    },
    secretKey
  );
  return token;
};
const verifyToken = (cookieName) => {
  const userPayload = JWT.verify(cookieName, secretKey);
  return userPayload;
};

module.exports = { generateToken, verifyToken };
