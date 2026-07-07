
const axios = require('axios');

require('dotenv').config()

const url = process.env.GEOAPIFY_BASE_URL
const goeApikey=process.env.GEOAPIFY_API_KEY



const getAddressCoordinate = async (address) => {
    if (!address || address.trim() === '') {
        throw new Error('Address is required');
    }
    


        const response=await axios.get(`${url}/v1/geocode/search`,{
            params:{
                text:address,
                format:'json',
                apiKey:goeApikey
            }
        })

        const data = response.data;

        if (!data.results || !data.results.length) {
        throw new Error('Geocoding failed: No results found');
        }

        return data.results;
    
 
    
};



const getDistanceTime=async(origin,destination)=>{
    
     if (!origin || !destination) {
        throw new Error('origin & distance is required');
    }
        //https://api.geoapify.com/v1/routing?waypoints=16.6014579,74.5097272|16.6959348,74.4555755&mode=drive&apiKey=YOUR_API_KEY

        const response = await axios.get(`${url}/v1/routing`, {
        params: {
            waypoints:`${origin}|${destination}`,
            mode:'drive',
            apiKey:goeApikey
           
        }
    });

    return response.data



}


module.exports={getAddressCoordinate,getDistanceTime}
