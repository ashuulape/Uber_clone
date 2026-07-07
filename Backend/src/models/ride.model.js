const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },

  origin: {
     type: String, 
        required: true,
    
  },

  destination: {
     type: String, 
        required: true,
     
    },

     vehicleType: {
        type: String,
        enum: ['auto', 'bike', 'car'],
        required: true,
      },  
  fare: {
     type: Number,
      default: 0
     },

  status: {
    type: String,
    enum: ['pending', 'accepted','ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },

  duration: { 
    type: Number,
     default: 0 
    },

  distance: { 
    type: Number, 
    default: 0 
},

  paymentId: { 
    type:String
   },

   orderId: {
     type:String
    },

   signature:{
    type: String
   },
   OTP:{
    type: String,
    select: false
   }



}
, { timestamps: true });

const RideModel = mongoose.model('ride', RideSchema);

module.exports = RideModel;
