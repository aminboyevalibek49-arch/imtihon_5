const { Router } = require("express");
const {
  getAllCotegoriysAdmin,
  getAllMadelsAdmin,
} = require("../controller/admin.controller");
const authorization = require("../middleware/authorization.middleware");

const AdminPanelRouter = Router();

AdminPanelRouter.get(
  "/get_all_cotegoriys_admin",
  authorization,
  getAllCotegoriysAdmin,
);
AdminPanelRouter.get("/get_all_madels_admin", authorization, getAllMadelsAdmin);

module.exports = {
  AdminPanelRouter,
};
