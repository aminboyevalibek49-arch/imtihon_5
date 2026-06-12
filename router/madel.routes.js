const { Router } = require("express");
const {
  getAllMadels,
  addMadel,
  getOneMadel,
  updateMadel,
  deleteMadel,
} = require("../controller/model.controller");
const authorization = require("../middleware/authorization.middleware");
const madelValidationMiddleware = require("../middleware/madel.validator.middleware");
const { upload } = require("../utils/multer");

const MadelRouter = Router();

MadelRouter.get("/get_all_madels", getAllMadels);
MadelRouter.get("/get_one_madel/:id", getOneMadel);
MadelRouter.post(
  "/add_madel",
  madelValidationMiddleware,
  authorization,
  upload.array("files", 3),
  addMadel,
);
MadelRouter.put(
  "/update_madel/:id",
  madelValidationMiddleware,
  authorization,
  upload.array("files", 3),
  updateMadel,
);
MadelRouter.delete("/delete_madel/:id", authorization, deleteMadel);

module.exports = MadelRouter;
