const express=require('express');
const dotenv = require("dotenv")
const connectToMongo=require('./databaseConnectivity')
const app=express();
const path=require('path')
connectToMongo();
const port=5000;

var cors = require('cors')
app.use(cors())
app.use(express.json())
dotenv.config()
// app.use("/uploads", express.static("uploads"));
app.use(express.static(__dirname));
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.use('/api/auth',require('./routes/auth'))
app.use('/api/blogs',require('./routes/blog'))

// if(process.env.NODE_ENV==='production'){
//     app.use(express.static('blogging_website/build'))
// }

app.listen(port,()=>{
    console.log("Listen to the port 5000")
})
