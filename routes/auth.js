const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation')
const User = require('../models/User')


// Register route
router.post('/register', async (req,res)=>{
    // Validate Data 
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send({"message" : error.details[0].message})


    // Check if email already exists
    const emailExist = await User.findOne({email : req.body.email})
    if(emailExist) return res.status(400).send({"message": "Email already exists"})

    // Get user's avatar
    const avatar = gravatar.url(req.body.email, {
        s : '200',
        r : 'pg',
        d : 'mm'
    }) 

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    

    const user = new User({
        name : req.body.name,
        username : req.body.username,
        email :req.body.email,
        avatar : avatar,
        password : hashedPassword
    })

    try {
        await user.save()
        res.send({"message" : "User registered successfully"})
    } catch (err) {
        res.status(500).send({"message" : "Server error"})
    }
})


// Login route

router.post('/login', async (req,res)=>{

    // Validate Data 
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send({"message" : error.details[0].message})

    // Check if user exists
    const user = await User.findOne({email : req.body.email})
    if(!user) return res.status(400).send({"message" : "Incorrect email. Please use your valid credentials"})

    // Check Password Validity
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send({"message" : "Incorrect password. Please use your valid credentials."})
 
    // Create JWT Token
    const token = await jwt.sign({
        id : user.id,
        name : user.name,
        username : user.username,
        email : user.email
    }, process.env.TOKEN_SECRET)

    res.header('token', token).send({"token" : token})
})

module.exports = router