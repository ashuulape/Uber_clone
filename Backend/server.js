require('dotenv').config();
const app=require('./src/app.js')
const express=require('express')
const http=require('http')
const dotenv=require('dotenv')
const connectDB=require('./src/Database/db.js')

dotenv.config();

connectDB();

const server=http.createServer(app);

server.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
