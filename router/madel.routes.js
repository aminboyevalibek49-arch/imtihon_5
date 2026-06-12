const { Router } = require("express");
const {
  getAllMadels,
  addMadel,
  getOneMadel,
  updateMadel,
  deleteMadel,
} = require("../controller/modellar.controller");
const authorization = require("../middleware/authorization");
const madellarValidationMiddleware = require("../middleware/madellar.validation.middleware");
const { upload } = require("../utils/multer");

const MadelRouter = Router();

MadelRouter.get("/get_all_madels", getAllMadels);
MadelRouter.get("/get_one_madel/:id", getOneMadel);
MadelRouter.post(
  "/add_madel",
  madellarValidationMiddleware,
  authorization,
  upload.array("files", 3),
  addMadel,
);
MadelRouter.put(
  "/update_madel/:id",
  madellarValidationMiddleware,
  authorization,
  upload.array("files", 3),
  updateMadel,
);
MadelRouter.delete("/delete_madel/:id", authorization, deleteMadel);

module.exports = MadelRouter;
