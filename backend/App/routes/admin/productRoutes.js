const express=require("express")
const { sizeView, colorView, subCategoryView, productInsert, parentcat, productView, multipleCategoryRowDelete } = require("../../controller/admin/productController")

const productRoute=express.Router()
const multer=require("multer")
const { uploads } = require("../../middleware/fileUploadation")


productRoute.post("/product-insert",uploads("uploads/product").fields([
    {
        name:'pdImg-input',
        maxCount:1
    },
    {
        name:'pdGalleryImg-input',
        maxCount:10
    }
]),productInsert)


productRoute.get("/product-view",productView)
productRoute.get("/multiple-delete",multipleCategoryRowDelete)

productRoute.get("/parent-category",parentcat)

productRoute.get("/size-view",sizeView)
productRoute.get("/color-view",colorView)




productRoute.get("/subcategory-view/:pid",subCategoryView)


module.exports={productRoute}