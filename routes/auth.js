const express = require('express');
const router = express.Router()
const User = require('../models/User')
const { registerValidation } = require('../validation')



// Register route
router.post('/register', async (req,res)=>{
    // Validate Data 
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    // Check if email already exists
    const emailExist = await User.findOne({email : req.body.email})
    if(emailExist) return res.status(400).send("Email already exists")

    const user = new User({
        name : req.body.name,
        email :req.body.email,
        password : req.body.password
    })

    try {
        const savedUser = await user.save()
        res.send( "User successfully registered")
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