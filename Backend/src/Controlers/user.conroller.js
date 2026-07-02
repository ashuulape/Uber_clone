const UserModel=require('../models/user.model')
const BlacklistModel=require('../models/blacklist.model')
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

        const useralreadyexist=await UserModel.findOne({email})
        if(useralreadyexist){
            return res.status(400).json({message:'user already exists'})
        }

        const hashpassword= await UserModel.hashpassword(password)

        const User=await UserModel.create({
            fullname:{firstname:firstname,
            lastname:lastname},
            email,
            password:hashpassword,
        })

        const token = User.generateJWT()

         res.cookie('token',token)

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
const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateJWT();

        res.cookie('token',token)

        res.status(200).json({
            message: 'User logged in successfully',
            user: user,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

const getUserprofile= async (req,res,next)=>{

    res.status(200).json(req.user)
}

const logoutUser=async(req,res,next)=>{
    try {
        const token=req.cookies.token
        await BlacklistModel.create({
            token:token

        })
        
        res.clearCookie('token')
        res.status(200).json({message:'User logged out successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

module.exports={registerUser, loginUser ,getUserprofile,logoutUser}