require("./db/mongoose");
const express = require("express");
const app = express();


const port = 3000 || process.env.PORT;




app.listen(port,()=>{
    console.log("Teh server is up on port " + port);
})