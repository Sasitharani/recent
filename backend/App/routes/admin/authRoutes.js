const express=require("express")
const { login } = require("../../controller/admin/auth/authController")
const authRoute=express.Router()

authRoute.post("/login",login)
module.exports={authRoute}