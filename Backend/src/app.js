const express = require("express");
const app=express()
const authRoutes=require('./Routes/auth.routes')
const captainRoutes=require('./Routes/captain.routes')
const cookieParser = require('cookie-parser');
const cors = require("cors");
const mapRoutes=require('./Routes/maps.routes')
const RideRoutes=require('./Routes/ride.routes')

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.onrender.com', // your actual deployed frontend URL
];

app.use(cors({
  origin:true,
  credentials: true,
}));



app.use('/api/auth',authRoutes)
app.use('/api/captain',captainRoutes)
app.use('/api/maps',mapRoutes)
app.use('/api/ride',RideRoutes)

app.get("/",(req,res)=>{
    res.send("Hello world")
})



module.exports=app