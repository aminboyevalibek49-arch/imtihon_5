const AuthSchema = require("../schema/auth.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");

const SuperAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userdata = await AuthSchema.findById(id);

    if (!userdata) {
      throw CustomErrorHandler.NotFound("ID bo'yicha malumot topilmadi");
    }

    const { role } = req.body;

    if (!role) {
      throw CustomErrorHandler.NotFound("Malumot topilmadi");
    }

    if (!["user", "admin", "superadmin"].includes(role)) {
      throw CustomErrorHandler.Forbidden(
        "Bunday rolega tayinlab bo'lmaydi asosiy rolelar: user, admin",
      );
    }

    if (role === "superadmin") {
      throw CustomErrorHandler.BadRequest("Superadminga tayinlash mumkin emas");
    }

    await AuthSchema.findByIdAndUpdate(id, { role });

    res.status(201).json({
      message: "Foydalanuvchining role qayta tayinlandi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  SuperAdmin,
};
