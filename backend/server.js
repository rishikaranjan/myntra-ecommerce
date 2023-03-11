import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import dotenv from 'dotenv';
import data from '../backend/Data.js';

import seedRouter from './Routes/seedRoutes.js';
import productRouter from './Routes/productRoutes.js';
import userRouter from './Routes/userRoutes.js';
import orderRouter  from './Routes/orderRoutes.js';
import uploadRouter from "./Routes/uploadRoutes.js";




//Get .env file

dotenv.config();



//App Config

const app = express();




//Database 

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });




//Middleware

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));




//API Endpoints



app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});



app.use('/api/seed', seedRouter);

app.use('/api/products', productRouter);

app.use('/api/users', userRouter);

app.use('/api/orders', orderRouter);

app.use('/api/upload', uploadRouter);


const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);


 
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});



//Listener


const port = process.env.PORT || 5000;

app.listen(port, () => {

    console.log("Connected");
    
});