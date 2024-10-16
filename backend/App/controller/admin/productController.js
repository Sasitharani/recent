const { categoryModel } = require("../../modal/admin/categoryModal")
const { colorModal } = require("../../modal/admin/colorModal")
const { productModal } = require("../../modal/admin/ProductModel")
const { sizeModal } = require("../../modal/admin/sizeModal")
const { subcategoryModel } = require("../../modal/admin/subCategoryModal")



let productInsert=async (req,res)=>{

 
   let insertobj={
    productName:req.body. productName,
    productDes:req.body. productDescription,
    productShortDes:req.body.productShortDescription,
    productStatus:req.body.status,
    productParentCat:req.body.productParentCatId,
    productSubParentCat:req.body.subParentCatSelectBox,
    productSize:req.body.productSizeId,
    productColor:req.body.productColorId,
    productPrice:req.body.pdPrice,
    productMrp:req.body.pdMRP,
   }
   
   if(req.files){
        if(req.files['pdImg-input']){
            insertobj['productImage']=req.files['pdImg-input'][0].filename
        }

        if(req.files['pdGalleryImg-input']){
            insertobj['productGallery'] =  req.files['pdGalleryImg-input'].map( items=>  items.filename )
        }
   }

   let productTable=await productModal(insertobj)
   let finalRes=await productTable.save()

  let obj={
    status:1,
    msg:"data save",
    finalRes
  }
   res.send(obj)
}

let productView=async (req,res)=>{
    
    let finalData=await productModal.find()
    .populate('productParentCat','categoryName,categoryDescription')
    .populate('productSubParentCat','subCategoryName')
    .populate('productSize','sizeName')
    .populate('productColor','colorName')


    let obj={
        status:1,
        data:finalData
    }
    res.send(obj)
}


let parentcat=async (req,res)=>{
    let productData=await categoryModel.find({ categoryStatus: 1 });
    res.status(200).json({
        status:1,
        datalist:productData
    })
}

let sizeView=async (req,res)=>{
    let sizeData=await sizeModal.find({sizeStatus:1})
    res.status(200).json({
        status:1,
        datalist:sizeData
    })
}


let subCategoryView=async (req,res)=>{

    let id=req.params.pid
    let subCatData=await subcategoryModel.find({subCategoryStatus:1,parentCategoryId:id})
    res.status(200).json({
        status:1,
        datalist:subCatData
    })    
}

let colorView=async (req,res)=>{
    let colorData=await colorModal.find({colorStatus:1})
    res.status(200).json({
        status:1,
        datalist:colorData
    })
}
module.exports={sizeView, colorView,subCategoryView,productInsert,parentcat,productView}