const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Routers 
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const profileRouter = require('./routes/profile')
const postRouter = require('./routes/posts')

// Route Middlewares
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/profile', profileRouter)
app.use('/api/posts', postRouter)
// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } ,()=> console.log("Connected to DB..."))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))