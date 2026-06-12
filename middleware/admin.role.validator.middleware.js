const CustomErrorHandler = require("../utils/custom.errorHandler");
const { SuperadminValidator } = require("../validator/superadmin.validator");

module.exports = function (req, res, next) {
  try {
    const { error } = SuperadminValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};
