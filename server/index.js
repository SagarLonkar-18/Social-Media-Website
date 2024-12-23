const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.get('/', (req, res) => {
    res.send("Goodbye");
});

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`App is listening on PORT : ${port}`);
});