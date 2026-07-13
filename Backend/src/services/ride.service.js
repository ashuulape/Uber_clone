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

    const fair=await getFare(origin,destination)


  

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

const confirmRide =async ({rideId, captain}) => {
  try  {if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+OTP');

    if (!ride) {
        throw new Error('Ride not found');
    }

    console.log('ride:'+ ride)

    return ride;}
    catch (error) {

        console.error(error)
    }
}

const startRide=async ({rideId,OTP, captain}) => {
        if (!rideId || !OTP) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+OTP');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.OTP !== OTP) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

const endRide=async ({rideId, captain}) => {
          if (!rideId ) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain:captain._id
    }).populate('user').populate('captain')

    if (!ride) {
        throw new Error('Ride not found');
    }

     if (ride.status !== 'ongoing') {
        throw new Error('Ride is not ongoing');
    }

     await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride
}

module.exports={
    getFare,
    createRide,
    confirmRide,
    startRide,
    endRide
}