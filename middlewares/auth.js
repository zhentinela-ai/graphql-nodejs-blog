const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const verified = jwt.verify(token, "unavezyotravez");
    req.verifiedUser = verified.user;
  } catch (error) {
    res.status(401).send("Invalid token");
  }

  next();
};

module.exports = {
  authenticate,
};
