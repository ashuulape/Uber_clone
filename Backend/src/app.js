const express = require("express");
const app=express()
const authRoutes=require('./Routes/auth.routes')
const captainRoutes=require('./Routes/captain.routes')
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/captain',captainRoutes)

app.get("/",(req,res)=>{
    res.send("Hello world")
})



module.exports=app