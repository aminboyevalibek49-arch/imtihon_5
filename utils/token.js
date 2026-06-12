const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("./custom-error-handler");

const accessToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: "15m" });
  } catch (error) {
    throw CustomErrorHandler.BadRequest(error.message);
  }
};

const refreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "15d" });
  } catch (error) {
    throw CustomErrorHandler.BadRequest(error.message);
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
