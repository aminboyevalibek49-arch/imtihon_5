const { Router } = require("express");
const {
  getAlluser,
  getOneuser,
  changePassword,
} = require("../controller/user.controller");
const { superadminTekshiruvchi } = require("../middleware/superadmin-verify");
const protocol = require("../middleware/protocol");

const UserRouter = Router();

UserRouter.get("/get_all_users", superadminTekshiruvchi, getAlluser);
UserRouter.get("/get_one_users/:id", superadminTekshiruvchi, getOneuser);
UserRouter.post("/change_password", protocol, changePassword);

module.exports = UserRouter;
