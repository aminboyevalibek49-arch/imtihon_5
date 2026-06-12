const { Router } = require("express");
const {
  register,
  verify,
  login,
  logout,
  forgotPassword,
  resendOtp,
} = require("../controller/auth.controller");
const refreshToken = require("../middleware/refresh.token.middleware");
const authValidationMiddleware = require("../middleware/auth.validator.midlleware");
const protocol = require("../middleware/protocol");

const AuthRouter = Router();

AuthRouter.post("/register", authValidationMiddleware, register);
AuthRouter.post("/verify", verify);
AuthRouter.post("/login", login);
AuthRouter.get("/refresh", refreshToken);
AuthRouter.get("/logout", protocol, logout);
AuthRouter.post("/resend_otp", resendOtp);
AuthRouter.post("/forgot_password", forgotPassword);

module.exports = AuthRouter;
