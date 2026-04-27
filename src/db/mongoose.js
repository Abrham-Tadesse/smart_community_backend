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



 //Deployment version

            // async function connectDB() {
            //   try {
            //     await mongoose.connect(url);
            //     console.log("✅ MongoDB connected");
            //   } catch (e) {
            //     console.error("❌ MongoDB connection failed:", e.message);
            //     process.exit(1); // kill the app
            //   }
            // }
        // module.exports = connectDB;