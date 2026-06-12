const Joi = require("joi");

exports.SuperadminValidator = function (data) {
  try {
    const schema = Joi.object({
      role: Joi.string()
        .trim()
        .pattern(new RegExp("^[a-zA-Z]{2,50}$"))
        .required(),
    });

    return schema.validate(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
