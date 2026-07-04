const express=require('express')
const router=express.Router()
const captaincontroller=require('../Controlers/captain.controller')
const { body } = require('express-validator')
const authMiddleware=require('../middlewares/auth.middleware')


const registervalidation = [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'auto', 'bike']).withMessage('Invalid vehicle type')
]

const loginvalidation=[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register',registervalidation, captaincontroller.registerCaptain)

router.post('/login',loginvalidation,captaincontroller.loginCaptain)

router.get('/profile',authMiddleware.authCaptain,captaincontroller.getCaptainProfile)

router.get('/logout',authMiddleware.authCaptain,captaincontroller.logOutCaptain)

module.exports=router
