const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const JWT=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            milength:[3,"username must be minimun 3 charectors"],
            maxlength:[20,"username must be less then 20 charectors"]
        },
        lastname:{
            type:String,
            required:true,
            milength:[2,"lastname must be minimun 2 charectors"],
            maxlength:[30,"lastname must be less then 30 charectors"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
       pattern: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,

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

userSchema.methods.generateJWT=function(){
    return JWT.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

userSchema.methods.comparePassword=function(password){
    return bcrypt.compare(password,this.password)
}

userSchema.statics.hashpassword=async (password) => {
    return await bcrypt.hash(password,10)
}

const UserModel=mongoose.model('user',userSchema)
module.exports=UserModel
