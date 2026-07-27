const express =require('express')
const router=express.Router()
const authmiddleware=require('../middlewares/auth.middleware')
const mapController=require('../Controlers/map.controller')
const {query, body}=require('express-validator')

const validateGetCoordinates=query('address').isString().notEmpty().withMessage('Address is required')
const validateGetDistanceTime=[
    query('origin').isString().notEmpty().withMessage('origin location reqiuired'),
query('destination').isString().notEmpty().withMessage('detination is required')]

const validatecurrentLocation=[
    query('lat').isFloat().withMessage('Invalid latitude'),
    query('lon').isFloat().withMessage('Invalid longitude')
]

router.get('/get-coordinates',validateGetCoordinates,authmiddleware.authUsers,mapController.getCoordinates)

router.get('/get-distance-time',validateGetDistanceTime,authmiddleware.authUsers,mapController.getDistanceTime)

router.get('/get-distance-time/coords',authmiddleware.authUsers,mapController.getDistanceTimeByCoords)

router.get('/get-suggestion',validateGetCoordinates,authmiddleware.authUsers,mapController.getSuggestion)

router.get('/current-location',validatecurrentLocation,mapController.getCurrentLocation)

module.exports=router