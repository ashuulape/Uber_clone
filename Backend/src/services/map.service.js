
const axios = require('axios');
require('dotenv').config()

const url = process.env.BASE_URL



const getAddressCoordinate = async (address) => {
    if (!address || address.trim() === '') {
        throw new Error('Address is required');
    }


    
    

    const response = await axios.get(`${url}/maps/orbis/places/geocode`, {
        params: {
            query:address,
           
        },
        headers:{
            'TomTom-Api-Key':process.env.TOM_TOM_API_KEY,
            'TomTom-Api-Version':2,
            Attributes:'results(title,position)'
        }
    });

    
    
    const data = response.data.results;


    // if (data.status !== 'OK' || !data.results.length) {
    //     throw new Error(`Geocoding failed: ${data.status} — ${data.error_message || 'No results found'}`);
    // }
 

    return data
        
    
};



const getDistanceTime=async()=>{
    
     if (!origin || !distance) {
        throw new Error('origin & distance is required');
    }

        const response = await axios.post(`${url}/routing/matrix/2/async?key=${process.env.TOM_TOM_API_KEY}`, {
        params: {
            query:address,
           
        },
        headers:{
            'TomTom-Api-Key':process.env.TOM_TOM_API_KEY,
            'TomTom-Api-Version':2,
            Attributes:'results(title,position)'
        }
    });

}


module.exports={getAddressCoordinate,getDistanceTime}
