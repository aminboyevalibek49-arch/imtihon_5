const { Schema, model } = require("mongoose");

const Seved = new Schema(
  {
    oner_id: {
      type: Schema.ObjectId,
      ref: "Auth",
      required: true,
    },
    madel_id: {
      type: Schema.ObjectId,
      ref: "Madellar",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const SevedSchema = model("Seved", Seved);

module.exports = SevedSchema;
