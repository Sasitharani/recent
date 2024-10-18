const express=require("express")
const { adminRoute } = require("./routes/adminRoute")
const mainRoute=express.Router()

mainRoute.use("/admin",adminRoute)

module.exports={mainRoute}
