let mongoose = require("mongoose");
let adminSchema = new mongoose.Schema( {
    adminEmail: String,
    adminPassword: String,
   
   
  },
  {
    timestamps: true,
  }
);
let adminModal = mongoose.model("admins" , adminSchema);
module.exports = {adminModal};