require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(authRoutes);


const monroUri = 'mongodb://127.0.0.1:27017/pos';
mongoose.connect(monroUri,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
});

mongoose.connection.on('connected', ()=>{
    console.log("Db connected!");
});

mongoose.connection.on('error', (err)=>{
    console.error('error connected with db', err);
});

app.listen(4000,()=>console.log("listen on port 4000")); 