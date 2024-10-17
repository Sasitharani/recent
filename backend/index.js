const express=require("express")
const cors=require("cors")
require("dotenv").config()
const mongoose = require('mongoose');
const { mainRoute } = require("./App/mainRoutes");
const { adminModal } = require("./App/modal/adminModel");
const app=express()


app.use(cors())
app.use(express.json())
app.use(mainRoute)
app.use("/uploads/category", express.static("uploads/category"))
app.use("/uploads/slider", express.static("uploads/slider"))
app.use("/uploads/subCategory", express.static("uploads/subCategory"))


mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`)
.then( async (res)=>{
    app.listen(process.env.SERVER_PORT)
    console.log(process.env.SERVER_PORT)
    let adminTable=await adminModal.find()

    if(adminTable.length==0){
        let saveData=new adminModal(
            {
                adminEmail:"admin@gmail.com",
                adminPassword:"admin123"
            }
        )

        saveData.save()
    }


})