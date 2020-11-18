const router = require('express').Router();
const User = require('../models/User');
const Profile = require('../models/Profile')
const verify = require('./verifyToken')

// Get all users
router.get('/', verify , async (req, res) => {
    const users = await User.find().select('-password')

    res.send(users)
})

// Get my user details
router.get('/me', verify , async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')

    res.send(user)
})

// GET a specific user by id
router.get('/:userId', verify , async (req, res) => {
    try {
        const user = await User.findOne({_id : req.params.userId}).select('-password')        
        res.json(user)
    } catch (error) {
        res.status(500).send(error)
    }

})

// Update existing user information
router.put('/:userId', verify , async (req, res) => {
    try {
        const user = await User.updateOne({_id : req.params.userId}, {$set : { name : req.body.name  }})
        res.json("User updated successfully")        
    } catch (error) {
        res.status(500).json(error)
    }
})

// Delete a user 
router.delete('/me', verify , async (req, res) => {
    try {
        await Profile.deleteOne({ user : req.user.id })
        await User.deleteOne({_id : req.user.id })
        res.json({message : "User Account successfully deleted"})
    } catch (error) {
        res.status(500).send({message : "Server error"})
    } 

})



module.exports = router