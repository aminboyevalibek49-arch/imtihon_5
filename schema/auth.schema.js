const { Schema, model } = require("mongoose");

const Auth = new Schema(
  {
    username: {
      type: String,
      required: [true, "username kiritilishi shart"],
      set: (value) => value.trim() /*.toUpperCase()*/,
      unique: true /*[false, "full_name unique bo'lishi kerak"]*/,
      minLength: [3, "Kamida 3 ta harfdan iborat bo'lsin"],
      match: [/^[a-zA-Z0-9]+$/, "faqat harf va raqam kiriting"],
    },
    email: {
      type: String,
      required: [true, "email kiritilishi shart"],
      unique: true /*[false, "full_name unique bo'lishi kerak"]*/,
      set: (value) => value.trim() /*.toUpperCase()*/,
      minLength: [15, "Kamida 15 ta belgidan iborat bo'lsin"],
    },
    password: {
      type: String,
      required: [true, "password kiritilishi shart"],
      set: (value) => value.trim() /*.toUpperCase()*/,
      minLength: [8, "Kamida 8 ta belgidan iborat bo'lsin"],
    },
    role: {
      type: String,
      set: (value) => value.toLowerCase(),
      enum: {
        values: ["superadmin", "admin", "user"],
        message: `{VALUE} bunday qiymat qabul qilanmaydi`,
      },
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otptime: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const AuthSchema = model("Auth", Auth);

module.exports = AuthSchema;
