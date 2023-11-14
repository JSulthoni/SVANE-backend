import express from 'express'
const app = express()
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))

// Import Route
import productRoute from './router/productRoute.js'
import stripeRoute from './router/stripeRoute.js'
import subcategoryRoute from './router/subcategoryRoute.js'

// Middleware
app.use('/api/products', productRoute)
app.use('/api/stripe', stripeRoute)
app.use('/api/subcategory', subcategoryRoute)

// Server homepage
app.get('/' , (req, res) => {
    res.send(`Hellow, this is BNDLR backend server. Running on port ${PORT}`)
})
    
// MongoDB connection    
const PORT = process.env.PORT || 3000
const URI = process.env.VITE_MONGO_API_URL   
mongoose.connect(URI)
    .then(() => {
        console.log(`Connecting to ${URI}`)
        app.listen(PORT, "0.0.0.0" , () => {
            console.log(`Connection successful on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log('Error while connecting to database ' + error)
    })
mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected!')
})
mongoose.connection.on('connected', () => {
    console.log('mongoDB connected!')
})
    


