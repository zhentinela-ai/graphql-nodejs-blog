const jwt = require("jsonwebtoken");

const createJWTToken = (user) => {
  return jwt.sign({ user }, "unavezyotravez", {
    expiresIn: "1d",
  });
};

module.exports = {
  createJWTToken,
};
