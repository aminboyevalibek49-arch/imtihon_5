const Joi = require("joi");

exports.CotegoriyaValidator = function (data) {
  try {
    const schema = Joi.object({
      Companiy: Joi.string()
        .trim()
        .pattern(new RegExp("^[a-zA-Z ]{2,200}$"))
        .required(),
      img_url: Joi.string().trim().min(2).required(),
    });

    return schema.validate(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
