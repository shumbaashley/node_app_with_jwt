const express = require('express');
const router = express.Router()
const User = require('../models/User')


// Validation
const Joi = require('@hapi/joi')

const schema = ""

// Register route
router.post('/register', async (req,res)=>{

    const user = new User({
        name : req.body.name,
        email :req.body.email,
        password : req.body.password
    })

    try {
        const savedUser = await user.save()
        res.send({
            "message" : "User successfully registered",
            "user": {
                "_id" : savedUser._id}
        })
    } catch (err) {
        res.status(400).send({"message" : err})
    }
})


// Login route



module.exports = router