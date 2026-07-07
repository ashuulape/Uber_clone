const express = require('express');
const crrouter = express.Router();
const {body} = require('express-validator');
const rideController = require('../Controlers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

rideValidation=[
    
    body('origin').notEmpty().withMessage('Pickup location is required'),
    body('destination').notEmpty().withMessage('Dropoff location is required'),
    body('vehicleType').isIn(['auto','bike','car']).withMessage('vehicle type must be auto, bike or car')
]


router.post('/create', authMiddleware.authUsers, rideValidation,rideController.createRide); 




module.exports = router;