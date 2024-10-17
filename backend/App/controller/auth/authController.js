const { adminModal } = require("../../../modal/adminModel")


let login=async (req,res)=>{
   let {uemail,upassword} =req.body;
   let obj
   try{
   let adminData=await adminModal.findOne({adminEmail:uemail,adminPassword:upassword});

        if(adminData){
            obj={
                status:1,
                adminData
            }
        }
        else{
            obj={
                status:0,
                msg:"Invalid userName or Password"
            }
        }
        res.send(obj)

    }
   catch(error){
        obj={
            status:0,
            
        }
     res.send(obj)
   }
 
}       

module.exports={login}