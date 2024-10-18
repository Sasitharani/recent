const mongoose = require("mongoose");

const productSchema =new mongoose.Schema(
  {
    productName: {
      type: String,
      unique: true
    },
    productImage: String,
    productMultipleImage: String,
    productDescription: String,
    productShortDescription:String,
    productStatus: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

const productModal=mongoose.model("product",productSchema)

module.exports={productModal}