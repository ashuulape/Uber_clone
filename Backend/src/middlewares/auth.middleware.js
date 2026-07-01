const UserModel=require('../models/user.model')
const JWT=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const BlacklistModel=require('../models/blacklist.model')

const authUsers=async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    const isTokenBlacklisted= await BlacklistModel.findOne({token:token})
    if(isTokenBlacklisted){
        return res.status(401).json({message:'Token is blacklisted , Login again'})
    }
    if(!token){
        return res.status(401).json({message:'unauthrized user login again  '})
    }
    
    try {
        const decodedToken=JWT.verify(token,process.env.JWT_SECRET)
        req.user=await UserModel.findById(decodedToken.id)
       
        
        return next()
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

module.exports={authUsers}