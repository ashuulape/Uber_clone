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
                title:data.title,
                lat:data.position.coordinates[0],
                lon:data.position.coordinates[1]
            }
        })
        
         console.log(data);
        res.status(200).json(finaldata)
    }catch(err){
        res.status(500).json({message:"internal server error"})
    }
}

const getDistanceTime=async (req,res,next) => {
     const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    
    const {origin,destination}=req.body

    try {
          const data=await mapservice.getDistanceTime(origin,destination)

        
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }

}

module.exports={getCoordinates,getDistanceTime}