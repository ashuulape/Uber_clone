const express =require('express')
const router=express.Router()
const authmiddleware=require('../middlewares/auth.middleware')
const mapController=require('../Controlers/map.controller')
const {query}=require('express-validator')

const validateGetCoordinates=query('address').isString().notEmpty().withMessage('Address is required')
const validateGetDistanceTime=[
    query('origin').isString().notEmpty().withMessage('origin location reqiuired'),
query('deatination').isString().notEmpty().withMessage('detination is required')]

router.get('/get-coordinates',validateGetCoordinates,authmiddleware.authUsers,mapController.getCoordinates)

router.get('/get-distance-time',validateGetDistanceTime,authmiddleware.authUsers,mapController.getDistanceTime)


module.exports=router