const mongoose = require("monggoose");


const URL = process.env.MONGODB_URL;
 async function main(){
    try{
      await mongoose.connect(URL,{});

    }catch(e){
     throw new Error("Couldn`t connect to mongodb " + e);
    }
 }