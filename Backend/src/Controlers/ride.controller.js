const rideService = require('../services/ride.service');
const {validationResult} = require('express-validator');


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

    } catch (error) {
        res.status(400).json({error: error.message});
    }


}


module.exports={createRide}

