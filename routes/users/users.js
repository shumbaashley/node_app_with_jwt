const router = require('express').Router();
const { findOneAndUpdate, updateOne } = require('../../models/User');
const User = require('../../models/User');
const verify = require('../verifyToken')

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

module.exports = router