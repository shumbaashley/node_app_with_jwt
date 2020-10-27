const router = require('express').Router();
const User = require('../../models/User');
const verify = require('../verifyToken')

// Get all users
router.get('/', verify , async (req, res) => {
    const users = await User.find()

    res.send(users)
})

// Get my user details
router.get('/me', verify , async (req, res) => {
    const user = req.user

    res.send(user)
})




module.exports = router