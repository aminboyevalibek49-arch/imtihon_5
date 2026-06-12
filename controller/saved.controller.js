const SevedSchema = require("../schema/seved.schema");
const MadellarSchema = require("../schema/modellar.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");

const getAllSeveds = async (req, res, next) => {
  try {
    const oner_id = req.user.id;
    const seveds = await SevedSchema.find({ oner_id }).populate("madel_id");
    res.status(200).json(seveds);
  } catch (error) {
    next(error);
  }
};

const addSeved = async (req, res, next) => {
  try {
    const { madel_id } = req.body;
    const oner_id = req.user.id;

    const madel = await MadellarSchema.findById(madel_id);
    if (!madel) {
      throw CustomErrorHandler.NotFound("Madel not found");
    }

    const existing = await SevedSchema.findOne({ oner_id, madel_id });
    if (existing) {
      throw CustomErrorHandler.BadRequest("Already saved");
    }

    await SevedSchema.create({ oner_id, madel_id });

    res.status(201).json({ message: "Saved!" });
  } catch (error) {
    next(error);
  }
};

const deleteSeved = async (req, res, next) => {
  try {
    const { madel_id } = req.body;
    const oner_id = req.user.id;

    const seved = await SevedSchema.findOneAndDelete({ oner_id, madel_id });

    if (!seved) {
      throw CustomErrorHandler.NotFound("Saved item not found");
    }

    res.status(200).json({ message: "Removed from saved" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSeveds,
  addSeved,
  deleteSeved,
};
