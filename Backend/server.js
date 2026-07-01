require('dotenv').config();
const app=require('./app')
const express=require('express')
const http=require('http')
const dotenv=require('dotenv')

dotenv.config();


const server=http.createServer(app);

server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
