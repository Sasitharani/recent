const { categoryModel } = require("../../modal/admin/categoryModal")
const { colorModal } = require("../../modal/admin/colorModal")
const { productModal } = require("../../modal/admin/ProductModel")
const { sizeModal } = require("../../modal/admin/sizeModal")
const { subcategoryModel } = require("../../modal/admin/subCategoryModal")



let productInsert=async (req,res)=>{

 //console.log(req.body.productSizeId) 
   let insertobj={
    productName:req.body. productName,
    productDes:req.body. productDescription,
    productShortDes:req.body.productShortDescription,
    productStatus:req.body.status,
    productParentCat:req.body.productParentCatId,
    productSubParentCat:req.body.subParentCatSelectBox,
    productPrice:req.body.pdPrice,
    productMrp:req.body.pdMRP,
   }
 
   if(req.body.productSizeId=='--Select Size--' ){
    console.log('--Select Size--')
    //console.log(insertobj)
   }else{
    console.log("else for size working")
    insertobj['productSize']=req.body.productSizeId
    console.log(req.body.productSizeId) 
    //console.log(insertobj)
   }
   if(req.body.productColorId=='--Select Color--'){
    console.log('--Select Color--')
   }else{
    insertobj['productColor']=req.body.productColorId
   }
   if(req.files){
        if(req.files['pdImg-input']){
            insertobj['productImage']=req.files['pdImg-input'][0].filename
        }

        if(req.files['pdGalleryImg-input']){
            insertobj['productGallery'] =  req.files['pdGalleryImg-input'].map( items=>  items.filename )
        }
   }
   console.log(insertobj)
   let productTable=await productModal(insertobj)
   let finalRes=await productTable.save()

  let obj={
    status:1,
    msg:"data save",
    finalRes
  }
  //console.log(obj)
   res.send(obj)
}

let productView=async (req,res)=>{
    let searchObject = {};
    
    let finalData=await productModal.find()
    .populate('productParentCat','categoryName,categoryDescription')
    .populate('productSubParentCat','subCategoryName')
    .populate('productSize','sizeName')
    .populate('productColor','colorName')

    const productData = await productModal.find(searchObject);
    let obj={
        status:1,
        data:finalData,
        path: process.env.CATEGORY_STATIC_PATH,
        dataList: productData,
    }
    res.send(obj)
}

let multipleCategoryRowDelete = async (req, res) => {
    console.log("ok ok")
    try {
      let { ids } = req.body;
      let deleteSingleRow;
      for (ID of ids) {
        const categoryData = await productModal.findOne({ _id: ID });
        if (categoryData) {
          let imageName = await categoryData.categoryImage;
          let path = "uploads/category/" + imageName;
          fs.unlinkSync(path);
  
          deleteSingleRow = await productModal.deleteOne({ _id: ID });
          if (deleteSingleRow.deletedCount == 0) {
            res.status(404).json({
              status: 0,
              message: "No record found to delete.",
            });
          }
        }
      }
      res.status(200).json({
        status: 1,
        message: "Data deleted.",
        res: deleteSingleRow,
      });
    } catch (error) {
      res.status(500).json({
        status: 0,
        message: "Server error occurred",
      });
    }
  };
  

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
module.exports={sizeView, colorView,subCategoryView,productInsert,parentcat,productView,multipleCategoryRowDelete}