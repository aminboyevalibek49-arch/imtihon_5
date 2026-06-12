const { Router } = require("express");
const { SuperAdmin } = require("../controller/superadmin.controller");
const { superadminTekshiruvchi } = require("../middleware/superadmin-verify");
const superadminValidationMiddleware = require("../middleware/superadmin-validation.middleware");

const SuperAdminRouter = Router();

SuperAdminRouter.put(
  "/super_admin/:id",
  superadminTekshiruvchi,
  superadminValidationMiddleware,
  SuperAdmin,
);

module.exports = {
  SuperAdminRouter,
};
