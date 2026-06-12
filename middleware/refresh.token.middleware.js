const CustomErrorHandler = require("../utils/custom.errorHandler");
const jwt = require("jsonwebtoken");
const { accessToken } = require("../utils/token-generator");

module.exports = function (req, res, next) {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      throw CustomErrorHandler.UnAuthorized("Refresh token not found");
    }

    const decode = jwt.verify(refresh_token, process.env.REFRESH_SECRET);

    const payload = {
      username: decode.username,
      email: decode.email,
      role: decode.role,
      id: decode.id, // _id emas, id (token payload'dagi)
    };
    const access_Token = accessToken(payload);

    res.cookie("access_token", access_Token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });

    return res.status(200).json({
      message: "Success",
      access_Token,
    });
  } catch (error) {
    next(error);
  }
};
