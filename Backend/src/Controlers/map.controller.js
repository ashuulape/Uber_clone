
const mapservice=require('../services/map.service')
const {validationResult}=require('express-validator')


const getCoordinates=async (req,res,next) => {

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {address}=req.query;

    

    try{
        const data=await mapservice.getAddressCoordinate(address)
        
    
        
         console.log(data);
        res.status(200).json(data)
    }catch(err){
        console.log(err);
        
        res.status(500).json({message:"internal server error"})
    }
}

const getDistanceTime=async (req,res,next) => {
     const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    
    const {origin,destination}=req.query


    

    try {
          const data=await mapservice.getDistanceTime(origin,destination)

            console.log(data);
        
          res.status(200).json(data)

        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"internal server error"})
    }

}

const getSuggestion=async (req,res,next) => {
      const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {address}=req.query;

    try{
        const data=await mapservice.Suggestion(address)

        res.status(200).json(data)
    }catch(err){
        console.log(err);
        
        res.status(500).json({message:"internal server error"})
    }
}

const getCurrentLocation=async (req,res,next) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {lat,lon}=req.query

    try {
          const response=await mapservice.CurrentLocation(lat,lon)

            

            const data=response.results[0].formatted
        
          res.status(200).json({address:data})

        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"internal server error"})
    }
}

module.exports={getCoordinates,getDistanceTime,getSuggestion,getCurrentLocation}