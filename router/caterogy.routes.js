const {Router} = require("express")
const {upload} = require("../utils/multer")
const { getAllCategoriys, addCotegory, getOneCotegory, updateCotegory, deleteCategory, AllUpdeteCategoriys } = require("../controller/category.controller")
const cotegoryValidationMiddleware = require("../middleware/cotegory-validation.middleware")
const authorization = require("../middleware/authorization")
const access = require("../middleware/access")

const CategoryRouter = Router()

CategoryRouter.get("/get_all_categories", access, getAllCategoriys)
CategoryRouter.get("/get_one_category/:id", access, getOneCategory)
CategoryRouter.post("/add_category", categoryValidationMiddleware, authorization, upload.single("file"), addCategory)
CategoryRouter.put("/update_category/:id", categoryValidationMiddleware, authorization, upload.single("file"), updateCategory)
CategoryRouter.delete("/delete_category/:id", authorization, deleteCategory)
CategoryRouter.put("/All_Updete_Cotegoriys", authorization, AllUpdeteCategoriys)

module.exports = CategoryRouter