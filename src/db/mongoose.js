require("dotenv").config({ path: "./src/.env" });
const mongoose = require("mongoose");


const URL = process.env.MONGODB_URL;

async function main() {
  try {
    await mongoose.connect(URL, {});
    console.log("MongoDB Connected");
  } catch (e) {
    console.log("MongoDB not Connected");
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
