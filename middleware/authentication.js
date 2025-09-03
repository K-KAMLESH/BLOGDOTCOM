const { verifyToken } = require("../service/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const cookieValue = req.cookies[cookieName];

    if (!cookieValue) {
      return next();
    }
    const userPayload = verifyToken(cookieValue);
    req.user = userPayload;
    return next();
  };
}

module.exports = checkForAuthenticationCookie;
