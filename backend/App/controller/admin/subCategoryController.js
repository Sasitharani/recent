const { categoryModel } = require("../../modal/admin/categoryModal");
const { subcategoryModel } = require("../../modal/admin/subCategoryModal");

let parentCategoryView = async (req, res) => {
  try {
    let categoryData = await categoryModel.find({ categoryStatus: 1 });
    res.status(200).json({
      status: 1,
      datalist: categoryData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal Server Error",
      error: error,
    });
  }
};

let subCategoryInsert = async (req, res) => {
  // console.log(req.body)
  // console.log(req.file)
  let subCategoryData = {
    subCategoryName: req.body.subCategoryName,
    parentCategoryId: req.body.parentCategoryId,
    subcatDescription: req.body.subcatDescription,
    subCategoryStatus: req.body.subCategoryStatus,
  };
  if (req.file) {
    if (req.file.filename) {
      subCategoryData["subCategoryImage"] = req.file.filename;
    }
  }
  try {
    const subCategoryCollection = new subcategoryModel(subCategoryData);
    console.log('return:'.subCategoryData)
    let subCatRes = await subCategoryCollection.save();
    res.status(200).json({
      status: 1,
      message: "Data saved.",
      res: subCatRes,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "sub category already exists !",
      error: error,
    });
  }
};

let subCategoryView = async (req, res) => {
  let searchObject={}
  let limit=5;
  try {
    let {subCatName,subCatDesc, pageNumber}=req.query
    if(subCatName!==""){
      searchObject['subCatName']=new RegExp(subCatName,"i")
    }
    if(subCatDesc!==""){
      searchObject['subCatDesc']=new RegExp(subCatDesc,"i")
    }
    let subCategoryData = await subcategoryModel.find(searchObject).skip((pageNumber-1)*limit).limit(limit).populate("parentCategoryId", "categoryName");
    let totalPageNumber=await subcategoryModel.find(searchObject)
    let allPage=Math.ceil(totalPageNumber.length/limit)
    res.status(200).json({
      status: 1,
      path:process.env.SUBCATEGORY_STATIC_PATH,
      datalist: subCategoryData,
      allPage,
      limit
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error !",
      error: error.message,
    });
  }
};

module.exports = { subCategoryInsert, parentCategoryView, subCategoryView };
