const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');

const registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname: { firstname, lastname }, email, password, vehicale } = req.body;

        if (!firstname || !email || !password || !vehicale || !vehicale.color || !vehicale.plate || !vehicale.capcity || !vehicale.vehicaleType) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const isCaptainExist = await captainModel.findOne({ email });
        if (isCaptainExist) {
            return res.status(400).json({ message: 'Captain already exists with this email' });
        }

        const hashpassword = await captainModel.hashpassword(password);

        const captain = await captainModel.create({
            fullname: {
                firstname:firstname,
                lastname:lastname
            },
            email,
            password: hashpassword,
            vehicale: {
                color: vehicale.color,
                plate: vehicale.plate,
                capcity: vehicale.capcity,
                vehicaleType: vehicale.vehicaleType
            }
        });

        const token = captain.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({
            message: 'Captain created successfully',
            captain,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const loginCaptain=async(req,res,next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const captain=await captainModel.findOne({email}).select('+password')

        if(!captain){
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch=await captain.ComparePassword(password)
        if(!isMatch){
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token=captain.generateAuthToken()

        res.cookie('token',token)
        res.status(200).json({
            message: 'Captain logged in successfully',
            captain,
            token
        });



        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    registerCaptain,loginCaptain
};
