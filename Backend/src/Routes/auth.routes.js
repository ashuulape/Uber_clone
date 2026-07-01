const express=require('express')
const router=express.Router()
const controller=require('../Controlers/user.conroller')
const {body}=require('express-validator')
const authMiddleware=require('../middlewares/auth.middleware')

const validation=[
    body('email').isEmail().withMessage('enter valid email address'),
    body('fullname.firstname').isString().withMessage('enter the first name'),
    body('fullname.lastname').isString().withMessage('enter the last name'),
]

router.post('/register',validation,controller.registerUser)

router.post('/login',controller.loginUser)

router.post('/logout',controller.logoutUser)

router.get('/profile',authMiddleware.authUsers,controller.getUserprofile)

module.exports=router
