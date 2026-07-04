const express = require("express");
const app=express()
const authRoutes=require('./Routes/auth.routes')
const captainRoutes=require('./Routes/captain.routes')
const cookieParser = require('cookie-parser');
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/auth',authRoutes)
app.use('/api/captain',captainRoutes)

app.get("/",(req,res)=>{
    res.send("Hello world")
})



module.exports=app