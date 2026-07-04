const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const JWT=require("jsonwebtoken")

const captainSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:3,
            maxLength:20},
        lastname:{
            type:String,
            required:true,
            minLength:2,
            maxLength:30
        }
     
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    socketid:{
        type:String,
        default:""
    },
     status:{
    type:String,
    enum:["active","inactive"],
    default:"inactive"
    },
    vehicle:{
    color:{
        type:String,
        required:true,
        minLength:[3],
        maxLength:[20]
    },
    plate:{
        type:String,
        required:true,
        minLength:[3],
        maxLength:[20]
    },
    capacity:{
        type:Number,
        required:true,
        min:1
    },
    vehicleType:{
        type:String,
        required:true,
        enum:['car','auto','bike']
    }

    },
    location:{ 
        lat:{
            type:Number
          
        },
        lng:{
            type:Number
            
        }
    } 
})

captainSchema.methods.generateAuthToken=function(){
    return JWT.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"1d"})
  
}

captainSchema.methods.ComparePassword=async function(password){
    return bcrypt.compare(password,this.password)
}

captainSchema.statics.hashpassword=async (password) => {
    return await bcrypt.hash(password,10)
}

const captainModel=mongoose.model('captain',captainSchema)

module.exports=captainModel


   
    
    
    
    