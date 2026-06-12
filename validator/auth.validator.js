const Joi = require("joi");

exports.AuthValidator = function (data) {
  try {
    const schema = Joi.object({
      username: Joi.string()
        .trim()
        .pattern(new RegExp("^[a-zA-Z]{3,50}$"))
        .required(),
      email: Joi.string().trim().max(50).required().email(),
      password: Joi.string().trim().min(8).max(200).required(),
    });

    return schema.validate(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
