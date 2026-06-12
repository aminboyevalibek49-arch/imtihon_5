const CustomErrorHandler = require("../utils/custom-error-handler");
const { MadellarValidator } = require("../validator/modellar.validation");

module.exports = function (req, res, next) {
  try {
    const { error } = MadellarValidator(req.body);

    if (error) {
      throw CustomErrorHandler.BadRequest(error.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};
