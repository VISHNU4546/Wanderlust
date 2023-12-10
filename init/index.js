const mongoose  = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");




// let MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl ="mongodb+srv://Vishnu4546:2wlpRnovvZvHDCdo@cluster0.o1itd3n.mongodb.net/?retryWrites=true&w=majority";


mongoose.connect(dbUrl).then((res)=>{
    console.log("connected to DB ")})
    .catch((err)=>{
            console.log(err);
        });


//clear all data
const initDB = async()=>{
    await Listing.deleteMany({})
    initData.data =  initData.data.map((ob)=>({...ob,owner:"657492ba43bdf8e209aaf686"}));
     await Listing.insertMany(initData.data)
    console.log("data was initialized");
}

initDB();