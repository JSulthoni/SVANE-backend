import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import productRoute from './router/productRoute.js';
import stripeRoute from './router/stripeRoute.js';
import categoryRoute from './router/categoryRoute.js';
import subcategoryRoute from './router/subcategoryRoute.js';
import bagRoute from './router/bagRoute.js';
import userRoute from './router/userRoute.js';
mongoose.set('strictQuery', false);
dotenv.config();
const app = express();


// Cors setting
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());


// Setting file directories from url to path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Routes
app.use('/api/products', productRoute);
app.use('/api/stripe', stripeRoute);
app.use('/api/category', categoryRoute);
app.use('/api/subcategory', subcategoryRoute);
app.use('/api/bag', bagRoute);
app.use('/api/user', userRoute);


// Server homepage
app.get('/', (req, res) => {
    // Serve static files from the root directory
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, 'server.html'))
});


// Error Handling
// This error handling is placed below any avaiable routes
// It meant for access to routes other than the available, or something went wrong with the access.
app.use((error, req, res, next) => {
    const errorStatus = error.status || 500
    const errorMessage = error.message || 'Service not available on this server'

    // Set CORS headers
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');


    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: error.stack
    })
});


// MongoDB and server connection    
const PORT = process.env.PORT || 3000; // PORT 3000
const URI = process.env.VITE_MONGO_API_URL;
mongoose.connect(URI)
    .then(() => {
        console.log(`Connected to database`)
        app.listen(PORT, "0.0.0.0" , () => {
            console.log(`Connection successful on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log('Error while connecting to database ' + error)
    });

mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnecting!')
});
mongoose.connection.on('connected', () => {
    console.log('mongoDB connecting!')
});
    


