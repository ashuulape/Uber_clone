const mongoose=require('mongoose')

const connectDB=()=>{
   try {
      mongoose.connect(process.env.MONGO_URI+'/uber')
      console.log('Mongodb connected sucessfully')
   } catch (error) {
      console.log('Mongodb connection failed',error)
   }
}

module.exports=connectDB