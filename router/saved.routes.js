const { Router } = require("express");
const protocol = require("../middleware/protocol");
const {
  addSeved,
  getAllSeveds,
  deleteSeved,
} = require("../controller/saved.controller");

const SevedRouter = Router();

SevedRouter.get("/get_all_seveds", protocol, getAllSeveds);
SevedRouter.post("/add_seved", protocol, addSeved);
SevedRouter.delete("/delete_seved", protocol, deleteSeved);

module.exports = SevedRouter;
