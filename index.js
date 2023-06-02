const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const recipeRoutes = require('./routes/Recipe')
const userRoutes = require('./routes/User')
const auth = require('./middleware/auth')

//dotenv
require('dotenv').config()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//routes
app.use('', userRoutes)
app.use('', auth, recipeRoutes)

//connection to db
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('connected to db');
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
    }).catch(err => {
        console.log(err);
    })