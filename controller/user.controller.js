const AuthSchema = require("../schema/auth.schema");
const CustomErrorHandler = require("../utils/custom.errorHandler");
const bcrypt = require("bcryptjs");

const getAlluser = async (req, res, next) => {
  try {
    const user = await AuthSchema.find();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getOneuser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await AuthSchema.findById(id);

    if (!user) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    // const foundedBook = await BookSchema.find({ book_id: id });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { email, current_password, new_password, confirm_password } =
      req.body;

    if (new_password !== confirm_password) {
      throw CustomErrorHandler.BadRequest(
        "new_password and confirm_password must be same",
      );
    }

    if (new_password === current_password) {
      throw CustomErrorHandler.BadRequest(
        "new_password and current_password must be different",
      );
    }

    const foundedUser = await AuthSchema.findOne({ email });

    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const compare = await bcrypt.compare(
      current_password,
      foundedUser.password,
    );

    if (compare) {
      if (req.user.email !== foundedUser.email) {
        throw CustomErrorHandler.Forbidden(
          "you have not access for this action",
        );
      }
      const hashPassword = await bcrypt.hash(new_password, 12);
      await AuthSchema.findByIdAndUpdate(foundedUser._id, {
        password: hashPassword,
      });
      return res.status(200).json({
        message: "Success",
      });
    } else {
      throw CustomErrorHandler.UnAuthorized("Wrong password");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlluser,
  getOneuser,
  changePassword,
};
