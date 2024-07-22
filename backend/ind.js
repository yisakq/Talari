const express=require("express");
const app=express()
app.use("/abc",(req,res)=>{
    res.send("server is running")
})