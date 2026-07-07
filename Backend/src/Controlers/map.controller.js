
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
        
        let finaldata=data.map((data)=>{
            return {
               country:data.country,
               state:data.state,
               address:data.formatted,
               city:data.city,
               lon:data.lon,
               lat:data.lat
            }
        })
        
         console.log(data);
        res.status(200).json(finaldata)
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
        
          res.status(200).json({message:'fetched sucess',data})

        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"internal server error"})
    }

}

module.exports={getCoordinates,getDistanceTime}