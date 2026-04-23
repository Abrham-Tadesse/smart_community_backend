require("./db/mongoose");
const express = require("express");
const app = express();
const userRouter = require("./routes/users.js");
const issueRouter = require("./routes/issues.js");
const commentRouter = require('./routes/comments.js');


const port = 3000 || process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(issueRouter);
app.use(commentRouter);



app.listen(port,()=>{
    console.log("Teh server is up on port " + port);
})