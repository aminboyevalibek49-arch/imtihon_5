const CustomErrorHandler = require("../utils/custom.errorHandler");
const { AuthValidator } = require("../validator/auth.validator");

module.exports = function (req, res, next) {
  try {
    const { error } = AuthValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};
