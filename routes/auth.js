const express = require('express');
const router = express.Router()
const User = require('../models/User')
const { registerValidation } = require('../validation')
const bcrypt = require('bcryptjs');


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

router.post('/login', (req,res)=>{

    const user = User.findOne({email : req.body.email})
    if(!user) return res.status(400).send("Email or password is wrong")

    // res.send({
    //     "message" : "Logged in succesfully",
    // })
})

module.exports = router