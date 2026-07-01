const UserModel=require('../models/user.model')
const {validationResult}=require('express-validator')

const registerUser=async(req,res,next)=>{

    try {

        const errors=validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {fullname:{firstname,lastname},email,password}=req.body

        if(!firstname ||!lastname ||!email ||!password){
            res.status(400).json({message:'all fields are required'})
            return next(error)
        }

        const hashpassword= await UserModel.hashpassword(password)

        const User=await UserModel.create({
            username:{firstname,lastname},
            email,
            password:hashpassword,
        })

        const token = User.generateJWT()

        res.status(200).json({
            message:'user created sucessfully',
            user:User,
            token:token
        })


    } catch (error) {
        console.log(error)
        res.status(404).json({
            message:error.message
        })
        
    }
}


module.exports={registerUser}