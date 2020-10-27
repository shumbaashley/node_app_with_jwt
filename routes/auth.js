const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation')
const User = require('../models/User')


// Register route
router.post('/register', async (req,res)=>{
    // Validate Data 
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    // Check if email already exists
    const emailExist = await User.findOne({email : req.body.email})
    if(emailExist) return res.status(400).send("Email already exists")

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    

    const user = new User({
        name : req.body.name,
        email :req.body.email,
        password : hashedPassword
    })

    try {
        const savedUser = await user.save()
        res.send("User registered successfully")
    } catch (err) {
        res.status(400).send(err)
    }
})


// Login route

router.post('/login', async (req,res)=>{

    // Validate Data 
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if user exists
    const user = await User.findOne({email : req.body.email})
    if(!user) return res.status(400).send("Email or password is wrong")

    // Check Password Validity
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Email or password is wrong")

    // Create JWT Token
    const token = await jwt.sign({
        _id : user._id,
        name : user.name,
        email : user.email
    }, process.env.TOKEN_SECRET)

    res.header('token', token).send({"token" : token})
})

module.exports = router