import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import productRoute from './router/productRoute.js';
import stripeRoute from './router/stripeRoute.js';
import subcategoryRoute from './router/subcategoryRoute.js';
mongoose.set('strictQuery', false);
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// Setting file directories from url to path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));


// Routes
app.use('/api/products', productRoute);
app.use('/api/stripe', stripeRoute);
app.use('/api/subcategory', subcategoryRoute);

// Error Handling
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'This is the error handler, something went wrong'
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
});


// Server homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'server.html'))
});


// MongoDB connection    
const PORT = process.env.PORT || 3000; // PORT cyclic 3000
const URI = process.env.VITE_MONGO_API_URL;
mongoose.connect(URI)
    .then(() => {
        console.log(`Connecting to database`)
        app.listen(PORT, "0.0.0.0" , () => {
            console.log(`Connection successful on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log('Error while connecting to database ' + error)
    });

mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected!')
});
mongoose.connection.on('connected', () => {
    console.log('mongoDB connected!')
});
    


