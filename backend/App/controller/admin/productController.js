const { categoryModel } = require("../../modal/admin/categoryModal")
const { colorModal } = require("../../modal/admin/colorModal")
const { productModal } = require("../../modal/admin/ProductModel")
const { sizeModal } = require("../../modal/admin/sizeModal")
const { subcategoryModel } = require("../../modal/admin/subCategoryModal")
fs = require("fs");



let productInsert=async (req,res)=>{
  console.log('working')
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
 console.log('working')
   if(req.body.productSizeId=='--Select Size--' ){
    console.log('--Select Size--')
    //console.log(insertobj)
   }else{
    console.log("else for size working")
    insertobj['productSize']=req.body.productSizeId
    //console.log(req.body.productSizeId) 
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
let singleProductDelete = async (req, res) => {
  //console.log('new new new')
  try {
    ///console.log('Inside Try Loop')
    let ID = req.params.id;
    //console.log(ID)
    const productData = await productModal.findOne({ _id: ID });
    if (productData) {
      let imageName = await productData.productImage;
      let path = "uploads/product/" + imageName;
      fs.unlinkSync(path);

      let deleteSingleRow = await productModal.deleteOne({ _id: ID }); 
      //console.log(deleteSingleRow)
      if (deleteSingleRow.deletedCount == 0) {
        return res.status(200).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
      res.status(200).json({
        status: 1,
        message: "Data deleted.",
        res: deleteSingleRow,

      });
    }
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "Server error occurred.",
    });
  }
};
let productView=async (req,res)=>{
    let searchObject = {};
    
    let finalData=await productModal.find()
    .populate('productParentCat','categoryName,categoryDescription')
    .populate('productSubParentCat','subCategoryName')
    .populate('productSize','sizeName')
    .populate('productColor','colorName')

    const productData = await productModal.find(searchObject);
    //console.log(process.env.PRODUCT_STATIC_PATH);
    let obj={
        status:1,
        data:finalData,
        path: process.env.PRODUCT_STATIC_PATH,
        dataList: productData,
    }
    res.send(obj)
}

let multipleCategoryRowDelete = async (req, res) => {
    //console.log(req.body)
    try {
      let { ids } = req.body;
      let deleteSingleRow;
      for (ID of ids) {
        
        const productData = await productModal.findOne({ _id: ID });
        
        if (productData) {
          //console.log(productData)---------working
          let imageName = await productData.productImage;
          //imageName = imageName.replace(/\s+/g, '');
          let path = "uploads/product/" + imageName;
          fs.unlinkSync(path);
          deleteSingleRow = await productModal.deleteOne({ _id: ID });
          console.log(deleteSingleRow.deletedCount)
          //------------working
          if (deleteSingleRow.deletedCount == 0) {
            res.status(200).json({
              status: 0,
              message: "No record found to delete.",
            });
          }
        }

      }
          console.log('More than Zero Count--should run only once')
           //------------working
          res.status(200).json({
            status: 1,
            message: "Data deleted.",
            res: deleteSingleRow,
          });
  
    } catch (error) {
      res.status(200).json({
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
module.exports={sizeView, colorView,subCategoryView,productInsert,parentcat,productView,multipleCategoryRowDelete,singleProductDelete}
