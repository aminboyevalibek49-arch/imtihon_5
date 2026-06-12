const AuthSchema = require("../schema/auth.schema");
const CotegoriyaSchema = require("../schema/cotegoriya.schema");
const MadellarSchema = require("../schema/modellar.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");
const logger = require("../utils/logger");

const getAllMadels = async (req, res, next) => {
  try {
    const Madel = await MadellarSchema.find();
    res.status(200).json(Madel);
  } catch (error) {
    next(error);
  }
};

const addMadel = async (req, res, next) => {
  try {
    const {
      nomi,
      color,
      gearbook,
      rasm_ichki,
      rasm_tashqi,
      madel_rasmi,
      description,
      tanirovka,
      year,
      distance,
      narx,
      cotegory_id,
    } = req.body;

    const access_id = req.user.id;
    const user = await AuthSchema.findById(access_id);

    if (!user._id) {
      throw CustomErrorHandler.NotFound("user not found");
    }

    const cotegory = await CotegoriyaSchema.findOne({
      Companiy: cotegory_id.toUpperCase(),
    });

    if (!cotegory) {
      throw CustomErrorHandler.NotFound("Bu categorya toyifasi topilmadi");
    }

    let rasmlar = [];

    for (let i = 0; i < req.files.length; i++) {
      rasmlar.push(req.files[i].filename);
    }

    await MadellarSchema.create({
      nomi,
      color,
      gearbook,
      rasm_ichki: rasmlar[0],
      rasm_tashqi: rasmlar[1],
      madel_rasmi: rasmlar[2],
      description,
      tanirovka,
      year,
      distance,
      narx,
      oner_id: user._id,
      cotegory_id: cotegory._id,
    });

    res.status(201).json({
      message: "Added new Madel",
    });
  } catch (error) {
    next(error);
  }
};

const getOneMadel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Madel = await MadellarSchema.findById(id);

    if (!Madel) {
      throw CustomErrorHandler.NotFound("Cotegory not found");
    }

    res.status(200).json(Madel);
  } catch (error) {
    next(error);
  }
};

const updateMadel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nomi,
      color,
      gearbook,
      rasm_ichki,
      rasm_tashqi,
      madel_rasmi,
      description,
      tanirovka,
      year,
      distance,
      narx,
      cotegory_id,
    } = req.body;

    const Madel = await MadellarSchema.findById(id);

    if (!Madel) {
      throw CustomErrorHandler.NotFound("Cotegory not found");
    }

    const access_id = req.user.id;
    const user = await AuthSchema.findById(access_id);

    if (!user._id) {
      throw CustomErrorHandler.NotFound("user not found");
    }

    const cotegory = await CotegoriyaSchema.findOne({
      Companiy: cotegory_id.toUpperCase(),
    });

    if (!cotegory) {
      throw CustomErrorHandler.NotFound("Bu categorya toyifasi topilmadi");
    }

    // o'zi qo'shganlarni o'zgartira olishligi uchun bu kodlar faqat ifni ichi

    if (req.user.role === "admin") {
      if (`${Madel.oner_id}` !== `${user._id}`) {
        logger.warn(`Bu sizga tegishli cotegorya emas: So'ralgan ID - ${id}`, {
          metadata: { url: req.originalUrl, id: req.user.id },
        });
        throw CustomErrorHandler.NotFound("This Madel is not yours");
      }
    }

    let rasmlar = [];

    for (let i = 0; i < req.files.length; i++) {
      rasmlar.push(req.files[i].filename);
    }

    await MadellarSchema.findByIdAndUpdate(id, {
      nomi,
      color,
      gearbook,
      rasm_ichki: rasmlar[0],
      rasm_tashqi: rasmlar[1],
      madel_rasmi: rasmlar[2],
      description,
      tanirovka,
      year,
      distance,
      narx,
      oner_id: user._id,
      cotegory_id: cotegory._id,
    });

    res.status(201).json({
      message: "Cotegory updated",
    });
  } catch (error) {
    next(error);
  }
};

const deleteMadel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Madel = await MadellarSchema.findById(id);

    if (!Madel) {
      throw CustomErrorHandler.NotFound("Madel not found");
    }

    const user = await AuthSchema.findById(req.user.id);

    // o'zi qo'shganlarni o'chira olishligi uchun bu kodlar faqat ifni ichi

    if (req.user.role === "admin") {
      if (`${Madel.oner_id}` !== `${user._id}`) {
        logger.warn(`Bu sizga tegishli cotegorya emas: So'ralgan ID - ${id}`, {
          metadata: { url: req.originalUrl, id: req.user.id },
        });
        throw CustomErrorHandler.NotFound("This Madel is not yours");
      }
    }

    await MadellarSchema.findByIdAndDelete(id);

    res.status(200).json({
      message: "Madel deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMadels,
  addMadel,
  getOneMadel,
  updateMadel,
  deleteMadel,
};
