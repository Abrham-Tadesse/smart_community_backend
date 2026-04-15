require("dotenv").config();
const mongoose = require("mongoose");


  const url = process.env.MONGODB_URL;

 async function main(){
    try{
      await mongoose.connect(url,{});

    }catch(e){
     console.log(e);
    }
 }

 main();
