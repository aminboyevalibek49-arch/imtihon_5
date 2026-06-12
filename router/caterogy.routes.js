const {Router} = require("express")
const {upload} = require("../utils/multer")
const { getAllCategoriys, addCotegory, getOneCotegory, updateCotegory, deleteCategory, AllUpdeteCategoriys } = require("../controller/caterogy.controller")
const cotegoryValidationMiddleware = require("../middleware/caterogy.validator.middleware")
const authorization = require("../middleware/authorization.middleware")
const access = require("../middleware/access.token.middleware")

const CategoryRouter = Router()

CategoryRouter.get("/get_all_categories", access, getAllCategoriys)
CategoryRouter.get("/get_one_category/:id", access, getOneCotegory)
CategoryRouter.post("/add_category", cotegoryValidationMiddleware, authorization, upload.single("file"), addCotegory)
CategoryRouter.put("/update_category/:id", cotegoryValidationMiddleware, authorization, upload.single("file"), updateCotegory)
CategoryRouter.delete("/delete_category/:id", authorization, deleteCategory)
CategoryRouter.put("/All_Updete_Cotegoriys", authorization, AllUpdeteCategoriys)

module.exports = CategoryRouter