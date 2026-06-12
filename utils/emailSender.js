const nodemailer = require("nodemailer");
const CustomErrorHandler = require("./custom.errorHandler");

module.exports = async function (code, email) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aminboyevalibek49@gmail.com",
        pass: process.env.APP_KEY,
      },
    });

    await transporter.sendMail({
      from: "Alibek",
      to: email,
      subject: "Library verification",
      text: "ushbu xabarda tasdiqlash kod keltirilgan",
      html: `<b style="color: red; font-size: 54px">${code}</b>`,
    });
  } catch (error) {
    throw CustomErrorHandler.BadRequest(error.message);
  }
};
