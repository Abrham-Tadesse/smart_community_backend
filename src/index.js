require("./db/mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/users.js");
const issueRouter = require("./routes/issues.js");
const commentRouter = require('./routes/comments.js');
// const connectDB = require("./db/mongoose");



app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

const port = process.env.PORT || 3000;
// middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/users",userRouter);
app.use("/api/issues",issueRouter);
app.use("/api/comments",commentRouter);



app.listen(port,()=>{
    console.log("Teh server is up on port " + port);
})


// Deployment version
        // connectDB().then(() => {
        // app.listen(port, () => {
        //     console.log("Server running");
        // });
        // });