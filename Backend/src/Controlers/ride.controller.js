const rideService = require('../services/ride.service');
const {validationResult} = require('express-validator');
const mapService=require('../services/map.service');
const RideModel = require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');


const createRide = async (req, res) => {

  
   const userId=req.user._id;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({validation: 'error' , errors: errors.array()});
    }

    const { origin, destination, vehicleType} = req.body;

    try {
        const ride = await rideService.createRide({ 
            userId,
            origin,
            destination,
            vehicleType
        });
        res.status(201).json(ride);

        const pickupcoordinate=await mapService.getAddressCoordinate(origin)

       
        
        
        const captainInRadius=await mapService.getCaptainsInTheRadius(pickupcoordinate[0].lat,pickupcoordinate[0].lon,2)
       
       const rideWithUer= await RideModel.findOne({_id:ride._id}).populate('user')
        ride.OTP=''

        console.log('captains in radius:', captainInRadius.map(c => ({ id: c._id, socketId: c.socketId })));
       captainInRadius.map(captain=>{
        
        sendMessageToSocketId(captain.socketId, 'new-ride', rideWithUer);
            
       
       })

    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message});
    }


}

const getFair = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({validation: 'error' , errors: errors.array()});
    }

    const { origin, destination } = req.query;

    try {
        const fair = await rideService.getFare(origin, destination);
        res.status(200).json(fair);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports={createRide, getFair ,confirmRide}

