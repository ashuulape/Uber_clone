const rideModel=require('../models/ride.model')
const mapsService=require('./map.service')
const crypto=require('crypto')

const getFare=async (origin, destination) => {
    
    if(!origin || !destination){
        throw new Error('origin & destination is required');
    }

    const distanceTime=await mapsService.getDistanceTime(origin,destination)


   

    const baseFareAuto = 50;
    const baseFareBike = 20;
    const baseFareCar = 80;
    const ratePerKmAuto = 15;
    const ratePerKmBike = 8;
    const ratePerKmCar = 20;
    const ratePerMinuteAuto = 2;
    const ratePerMinuteBike = 1;
    const ratePerMinuteCar = 3;

    const distance = distanceTime.features[0].properties.distance / 1000;
    const duration = distanceTime.features[0].properties.time / 60;

    const autoFare = baseFareAuto + (distance * ratePerKmAuto) + (duration * ratePerMinuteAuto);
    const bikeFare = baseFareBike + (distance * ratePerKmBike) + (duration * ratePerMinuteBike);
    const carFare = baseFareCar + (distance * ratePerKmCar) + (duration * ratePerMinuteCar);

    return {
        auto: Math.round(autoFare),
        bike: Math.round(bikeFare),
        car: Math.round(carFare),
        distance: Math.round(distance)
    };
}

const getOTP= () => {
   

    // generate a 6-digit numeric OTP using crypto
    const otp = crypto.randomInt(100000, 1000000).toString();

    return otp;
}

const createRide=async ({userId, origin, destination,vehicleType}) => {
    
   
    if(!userId || !origin || !destination || !vehicleType){
        throw new Error('userId, origin, destination and vehicleType is required');
    }

    const fair=await getFair(origin,destination)

  

    const ride= await rideModel.create({
        user:userId,
        origin:origin,
        destination:destination,
        vehicleType:vehicleType,
        OTP:getOTP(),
        fare:fair[vehicleType],
        distance:fair.distance
    }); 

    return ride;
};

module.exports={
    getFare,
    createRide
}