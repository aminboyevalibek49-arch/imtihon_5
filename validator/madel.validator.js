const Joi = require("joi");

exports.MadellarValidator = function (data) {
  try {
    const schema = Joi.object({
      nomi: Joi.string()
        .trim()
        .pattern(new RegExp("^[a-zA-Z0-9 ]{2,200}$"))
        .required(),
      color: Joi.string().trim().min(2).required(),
      gearbook: Joi.string().trim().min(2).required(),
      rasm_ichki: Joi.string().trim().min(2).required(),
      rasm_tashqi: Joi.string().trim().min(2).required(),
      madel_rasmi: Joi.string().trim().min(2).required(),
      description: Joi.string().trim().min(2).required(),
      tanirovka: Joi.boolean().required(),
      year: Joi.number().required(),
      distance: Joi.number().min(2).required(),
      narx: Joi.number().min(4).required(),
      cotegory_id: Joi.string().trim().min(2).required(),
    });

    return schema.validate(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
