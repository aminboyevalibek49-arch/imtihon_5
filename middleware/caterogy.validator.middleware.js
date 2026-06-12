const CustomErrorHandler = require("../utils/custom-error-handler");
const { CotegoriyaValidator } = require("../validator/cotegoriya.validation");

module.exports = function (req, res, next) {
  try {
    const { error } = CotegoriyaValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};
