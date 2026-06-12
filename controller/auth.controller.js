const AuthSchema = require("../schema/auth.schema");
const CustomErrorHandler = require("../utils/custom.errorHandler");
const bcrypt = require("bcryptjs");
const emailSender = require("../utils/emailSender");
const { accessToken, refreshToken } = require("../utils/token");
const logger = require("../utils/logger");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    logger.info(`Registerga murojat: Username - ${username}`, {
      metadata: { ip: req.ip, host: req.host, url: req.originalUrl, email },
    });

    if (foundedUser) {
      logger.warn(`User avvaldan bor - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
          username,
        },
      });
      throw CustomErrorHandler.UnAuthorized("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const rendomNumbers = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");

    const time = Date.now() + 120000;

    await AuthSchema.create({
      username,
      email,
      password: hashPassword,
      otp: rendomNumbers,
      otptime: time,
    });

    await emailSender(rendomNumbers, email);

    logger.info(`Emailga kod yuborildi va register qilindi: Email - ${email}`, {
      metadata: {
        ip: req.ip,
        host: req.host,
        url: req.originalUrl,
        rendomNumbers,
      },
    });

    console.log(rendomNumbers, email);

    res.status(201).json({
      message: "Registered!",
    });
  } catch (error) {
    logger.error(`Kategoriya olishda xatolik: ${error.message}`, {
      metadata: {
        userId: req.user?.id,
        stack: error.stack,
        params: req.params,
      },
    });
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    logger.info(`verifyga murojat: Email - ${email}`, {
      metadata: { ip: req.ip, host: req.host, url: req.originalUrl, email },
    });

    const foundedUser = await AuthSchema.findOne({ email });

    if (!foundedUser) {
      logger.warn(`User topilmadi - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const time = Date.now();

    if (foundedUser.otptime < time) {
      logger.warn(`OTP time eskirgan - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.BadRequest("Otp time expired");
    }

    if (foundedUser.otp !== otp) {
      logger.warn(`OTP mos emas - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.BadRequest("Wrong verification code");
    }

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      isVerified: true,
    });

    const payload = {
      username: foundedUser.username,
      email: foundedUser.email,
      role: foundedUser.role,
      id: foundedUser._id,
    };
    const access_Token = accessToken(payload);
    const refresh_Token = refreshToken(payload);

    res.cookie("access_token", access_Token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refresh_token", refresh_Token, {
      httpOnly: true,
      maxAge: 3600 * 1000 * 24 * 15,
    });

    logger.info(`verifiqatsiyadan yaxshi o'tildi: Email - ${email}`, {
      metadata: { ip: req.ip, host: req.host, url: req.originalUrl, email },
    });

    res.status(200).json({
      message: "Success",
      access_Token,
    });
  } catch (error) {
    logger.error(`Kategoriya olishda xatolik: ${error.message}`, {
      metadata: {
        userId: req.user?.id,
        stack: error.stack,
        params: req.params,
      },
    });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    logger.info(`Loginga murojat: Email - ${email}`, {
      metadata: { ip: req.ip, host: req.host, url: req.originalUrl, email },
    });

    if (!foundedUser) {
      logger.warn(`User topilmadi - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const compare = await bcrypt.compare(password, foundedUser.password);

    if (compare && foundedUser.isVerified) {
      logger.info(
        `Loginga murojat isVerified va compare to'g'ri: Email - ${email}`,
        {
          metadata: {
            ip: req.ip,
            host: req.host,
            url: req.originalUrl,
            email,
            isVerified: foundedUser.isVerified,
            compare,
          },
        },
      );

      const payload = {
        username: foundedUser.username,
        email: foundedUser.email,
        role: foundedUser.role,
        id: foundedUser._id,
      };
      const access_Token = accessToken(payload);
      const refresh_Token = refreshToken(payload);

      res.cookie("access_token", access_Token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
      });
      res.cookie("refresh_token", refresh_Token, {
        httpOnly: true,
        maxAge: 3600 * 1000 * 24 * 15,
      });

      logger.info(`Saytga login qilib kirildi: Email - ${email}`, {
        metadata: { ip: req.ip, host: req.host, url: req.originalUrl, email },
      });

      res.status(200).json({
        message: "Success",
        access_Token,
      });
    } else {
      logger.warn(`Xato kalit - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
          password,
        },
      });
      throw CustomErrorHandler.UnAuthorized("Invalid password");
    }
  } catch (error) {
    logger.error(`Kategoriya olishda xatolik: ${error.message}`, {
      metadata: {
        userId: req.user?.id,
        stack: error.stack,
        params: req.params,
      },
    });
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    logger.info(`Logout qilindi: Email - ${req.user.id}`, {
      metadata: {
        ip: req.ip,
        host: req.host,
        url: req.originalUrl,
        email: req.user.email,
      },
    });
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({
      message: "Logout",
    });
  } catch (error) {
    logger.error(`Kategoriya olishda xatolik: ${error.message}`, {
      metadata: {
        userId: req.user?.id,
        stack: error.stack,
        params: req.params,
      },
    });
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await AuthSchema.findOne({ email });

    logger.info(`Resend otpga murojat: Email - ${email}`, {
      metadata: { ip: req.ip, host: req.host, url: req.originalUrl, email },
    });

    if (!user) {
      logger.warn(`User topilmadi - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const rendomNumber = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");

    const time = Date.now() + 120000;

    await AuthSchema.findByIdAndUpdate(user._id, {
      otp: rendomNumber,
      otptime: time,
    });

    await emailSender(rendomNumber, email);
    console.log(rendomNumber, email);

    logger.info(`Resend otpdan kod yuborildi: Email - ${email}`, {
      metadata: {
        ip: req.ip,
        host: req.host,
        url: req.originalUrl,
        email,
        rendomNumber,
      },
    });

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    logger.error(`Kategoriya olishda xatolik: ${error.message}`, {
      metadata: {
        userId: req.user?.id,
        stack: error.stack,
        params: req.params,
      },
    });
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email, otp, new_password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    logger.info(`Unitilgan kodni qaytatiklashga murojat: Email - ${email}`, {
      metadata: {
        ip: req.ip,
        host: req.host,
        url: req.originalUrl,
        email,
        otp,
      },
    });

    if (!foundedUser) {
      logger.warn(`User topilmadi - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const time = Date.now();

    if (foundedUser.otptime < time) {
      logger.warn(`OTP time eskirgan - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.BadRequest("Otp time expired");
    }

    if (foundedUser.otp !== otp) {
      logger.warn(`OTP mos emas - ${email}`, {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
        },
      });
      throw CustomErrorHandler.BadRequest("Wrong verification code");
    }

    const hashPassword = await bcrypt.hash(new_password, 12);

    foundedUser.password = hashPassword;

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      password: hashPassword,
    });

    logger.info(
      `Unitilgan kodni qaytatiklash bajarildi kod qaytatiklandi: Email - ${email}`,
      {
        metadata: {
          ip: req.ip,
          host: req.host,
          url: req.originalUrl,
          email,
          otp,
        },
      },
    );

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    logger.error(`Kategoriya olishda xatolik: ${error.message}`, {
      metadata: {
        userId: req.user?.id,
        stack: error.stack,
        params: req.params,
      },
    });
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  logout,
  resendOtp,
  forgotPassword,
};
