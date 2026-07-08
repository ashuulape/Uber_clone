
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

        const finaldata= data.results.map((data)=>{
            return {
               country:data.country,
               state:data.state,
               address:data.formatted,
               city:data.city,
               lon:data.lon,
               lat:data.lat
            }
        })
    
 return finaldata
    
};



const getDistanceTime=async(origin,destination)=>{
    
     if (!origin || !destination) {
        throw new Error('origin & distance is required');
    }


   const originCoords= await getAddressCoordinate(origin)
   const destinationCoords=await getAddressCoordinate(destination)

   const originLonLat=`${originCoords[0].lat},${originCoords[0].lon}`
   const destinationLonLat=`${destinationCoords[0].lat},${destinationCoords[0].lon}`

  
   

        // https://api.geoapify.com/v1/routing?waypoints=16.6014579,74.5097272|16.6959348,74.4555755&mode=drive&apiKey=YOUR_API_KEY

        const response = await axios.get(`${url}/v1/routing`, {
        params: {
            waypoints:`${originLonLat}|${destinationLonLat}`,
            mode:'drive',
            apiKey:goeApikey
           
        }
    });

    return response.data



}


const Suggestion=async (address) => {

    if(!address){
        throw new Error('query is rewquired')
        
        
    }
    
    const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${url}/v1/geocode/autocomplete`,
   params:{
                text:address,
                limit:5,
                format:'json',
                apiKey:goeApikey
            },
  headers: { }
};

try {
  const response = await axios.request(config);
  console.log(JSON.stringify(response.data));
    return response.data

} catch (error) {
  console.log(error);
  throw error;
}

}

const CurrentLocation=async (lat,lon) => {

    if(!lat || !lon){
        throw new Error('lat & lon is required')
    }

    const response = await axios.get(`${url}/v1/geocode/reverse`, {
        params: {
            lat,
            lon,
            format: 'json',
            apiKey: goeApikey
        }
    });

    return response.data;
}

module.exports={getAddressCoordinate,getDistanceTime,Suggestion,CurrentLocation  }
