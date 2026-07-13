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

    const { origin, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ 
            userId,
            origin,
            destination,
            vehicleType
        });
        res.status(201).json(ride);

        const pickupcoordinate=await mapService.getAddressCoordinate(origin)

       
        
        
        const captainInRadius=await mapService.getCaptainsInTheRadius(pickupcoordinate[0].lat,pickupcoordinate[0].lon,10)
       
       const rideWithUer= await RideModel.findOne({_id:ride._id}).populate('user')
        ride.OTP=''

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

    const { rideId ,captainId } = req.body;
    console.log(req.body)

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain});
        console.log("Bckendride:",ride);

        const rideObj = ride.toObject();
if (rideObj.captain) delete rideObj.captain.password;
        
        sendMessageToSocketId(ride.user.socketId, 'ride-confirmed', rideObj);

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

const startRide=async (req,res) => {
    
const error=validationResult(req)
if(!error.isEmpty()){
     return res.status(400).json({ errors: errors.array() });
}

const {rideId,OTP}=req.query

 try {
        const ride = await rideService.startRide({ rideId,OTP, captain: req.captain});
        
        
        sendMessageToSocketId(ride.user.socketId, 'ride-started', ride);

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }


    

}

const endRide=async (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error:error.message})
    }


    const {rideId}=req.body
console.log(rideId);

    try {
        const ride = await rideService.endRide({rideId,captain:req.captain})

        sendMessageToSocketId(ride.user.socketId, 'ride-ended', ride)

        res.status(200).json(ride)

    } catch (error) {
        return res.status(500).json({message:'error in controller'})
    }
}

module.exports={createRide, getFair ,confirmRide,startRide,endRide}

