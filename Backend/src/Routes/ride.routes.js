const express = require('express');
const { body, query } = require('express-validator');
const rideController = require('../Controlers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

rideValidation=[
    
    body('origin').notEmpty().withMessage('Pickup location is required'),
    body('destination').notEmpty().withMessage('Dropoff location is required'),
    body('vehicleType').isIn(['auto','bike','car']).withMessage('vehicle type must be auto, bike or car')
]

fareValidation=[
    query('origin').notEmpty().withMessage('Pickup location is required'),
    query('destination').notEmpty().withMessage('Dropoff location is required')
]

confirmValidation=[
    body('rideId').isMongoId().withMessage('Invalid Id'),
    
]


router.post('/create', authMiddleware.authUsers, rideValidation,rideController.createRide); 
router.get('/getfare', authMiddleware.authUsers, fareValidation, rideController.getFair);
router.post('/confirm', authMiddleware.authCaptain,confirmValidation, rideController.confirmRide);




module.exports = router;