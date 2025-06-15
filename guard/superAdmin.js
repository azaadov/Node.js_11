const jwt=require("jsonwebtoken")

function checkSuperAdmin(req, res, next) {
    try{
     const token=req.headers.authorization
     if(!token){
        return res.status(401).json({
            msg:"token not found"
        })
     }

     const bearer=token.split(" ")[0]
     const access_token=token.split(" ")[1]
     
     if(!bearer || bearer!=="Bearer"){
        return res.status(401).json({
            msg:"bearer not found"
        })
     }

     if(!access_token){
        return res.status(401).json({
            msg:"Access token not found"
        })
     }

     const decode=jwt.verify(access_token, process.env.SEKRET_KEY)
     
     req.user=decode
     if(req.user.role!=="superadmin"){
        return res.status(401).json({
            msg:"you are not superadmin"
        })
     }
     next()
    }catch(error){
    res.json({msg:error.message});
    }
}


module.exports={checkSuperAdmin}