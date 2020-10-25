const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

const authRouter = require('./routes/auth')

// Route Middlewares
app.use('/api/user', authRouter)

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true } ,()=> console.log("Connected to DB..."))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))