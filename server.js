const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const dotenv = require('dotenv')
const productRoute = require('./router/productRoute')
const stripeRoute = require('./router/stripeRoute')
const subcategoryRoute = require('./router/subcategoryRoute')
const cors = require('cors')
dotenv.config()


// use
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/api/products', productRoute)
app.use('/api/payment', stripeRoute)
app.use('/api/subcategory', subcategoryRoute)

// server homepage
app.get('/' , (req, res) => {
    res.send('server is running...')
})

const URI = process.env.VITE_MONGO_API_URL
mongoose.connect(URI)
    .then(() => {
        console.log(`Connecting to ${URI}`)
        app.listen(process.env.PORT || 3000 , () => {
            console.log(`${process.env.PORT} Connection successful`)
        })
    })
    .catch((error) => {
        console.log('Error while connecting to database ' + error)
    })



