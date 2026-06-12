const { Schema, model } = require("mongoose");

const Madellar = new Schema(
  {
    nomi: {
      type: String,
      required: [true, "nomi kiritilishi shart"],
      unique: true /*[false, "full_name unique bo'lishi kerak"]*/,
      set: (value) => value.trim().toUpperCase(),
    },
    color: {
      type: String,
      required: [true, "rangi kiritilishi shart"],
      set: (value) => value.trim().toUpperCase(),
    },
    gearbook: {
      type: String,
      required: true,
    },
    rasm_ichki: {
      type: String,
      required: true,
    },
    rasm_tashqi: {
      type: String,
      required: true,
    },
    madel_rasmi: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tanirovka: {
      type: Boolean,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    narx: {
      type: Number,
      required: true,
    },
    oner_id: {
      type: Schema.ObjectId,
      ref: "Auth",
      required: true,
    },
    cotegory_id: {
      type: Schema.ObjectId,
      ref: "Cotegoriya",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const MadellarSchema = model("Madellar", Madellar);

module.exports = MadellarSchema;
