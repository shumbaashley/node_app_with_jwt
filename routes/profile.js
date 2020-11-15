const router = require('express').Router();
const Profile = require('../models/Profile')
const verify = require('./verifyToken')
const {profileValidation} = require('../validation');


// Get my user profile
router.get('/me', verify, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.user.id }).populate('User', ['name', 'username', 'avatar', 'email']) 

        if(!profile){
            return res.status(404).json({"message" : "There is no profile for this user"})
        }

        return res.json(profile)

    } catch (error) {
        res.json({"message" : "There was some error"})
    }
})   
 
// Create user profile
router.post('/', verify, async (req, res) => {

    // Validate Data 
    const { error } = profileValidation(req.body)
    if(error) return res.status(400).send({"message" : error.details[0].message})

    // Turn Skills into array

    try {

        // find if profile exists
        const profile = await Profile.findOne({ user : req.user.id })
        if(profile) return res.status(400).json({"message" : "This user's profile already exists"})

        const skills = req.body.skills

        const profileSkills = skills.split(',').map(skill => skill.trim())

        const newProfile = new Profile({
            user : req.user.id,
            company : req.body.company, 
            website : req.body.website, 
            skills : profileSkills,
            location : req.body.location,
            bio : req.body.bio
        })

        await newProfile.save()
 
        return res.status(201).json({"message" : "Profile created successfully"})

    } catch (error) {
        res.status(500).json({"message" : "There was some error"})
    }
})

// Get all profiles 
router.get('/',  verify , async (req,res) =>{
    try {
        const profiles = await Profile.find()
        return res.json(profiles)
    } catch (error) {
        res.status(500).json(error)
    }
})
 
// Update user profile
router.put('', verify, async (req, res) => {

    // Validate Data 
    const { error } = profileValidation(req.body)
    if(error) return res.status(400).send({"message" : error.details[0].message})
    // Turn Skills into array

    try {
        // find if profile exists
        const profile = await Profile.findOne({ user : req.user.id })
        if(!profile) return res.status(404).json({"message" : "This user's profile does not exists"})

        const { company, website, skills , bio, location} = req.body
 
        const profileDetails = {}
 
        if(company) profileDetails.company = company
        if(website) profileDetails.website = website
        if(bio) profileDetails.bio = bio
        if(location) profileDetails.location = location
        if(skills) {
            profileDetails.skills = skills.split(',').map(skill => skill.trim())
        }
        const updatedProfile = await Profile.updateOne(
            {user : req.user.id}, 
            {$set : profileDetails},
            {new : true}
        )
         res.status(200).json({"message" : "Profile updated successfully"})

    } catch (error) {
         res.status(500).send({"message" : "Server error"})
    }
})

// Update user profile
router.patch('', verify, async (req, res) => {

    // Validate Data 
    const { error } = profileValidation(req.body)
    if(error) return res.status(400).send({"message" : error.details[0].message})
    // Turn Skills into array

    try {
        // find if profile exists
        const profile = await Profile.findOne({ user : req.user.id })
        if(!profile) return res.status(404).json({"message" : "This user's profile does not exists"})

        const { company, website, skills , bio, location} = req.body
 
        const profileDetails = {}
 
        if(company) profileDetails.company = company
        if(website) profileDetails.website = website
        if(bio) profileDetails.bio = bio
        if(location) profileDetails.location = location
        if(skills) {
            profileDetails.skills = skills.split(',').map(skill => skill.trim())
        }
        const updatedProfile = await Profile.updateOne(
            {user : req.user.id}, 
            {$set : profileDetails},
            {new : true}
        )
         res.status(200).json({"message" : "Profile updated successfully"})

    } catch (error) {
         res.status(500).send({"message" : "Server error" })
    }
})

// Get user profile by Id
router.get('/:id', verify, async (req, res) => {


    try {
        // find if profile exists
        const profile = await Profile.findOne({ _id : req.params.id })
        if(!profile) return res.status(404).json({"message" : "This user's profile does not exists"})

         res.status(200).json(profile)

    } catch (error) {
         res.status(500).send({"message" : "Sever error"})
    }
})

 
// Delete user profile
router.delete('/:id', verify, async (req, res) => {


    try {
        // find if profile exists
        const profile = await Profile.findOne({ _id : req.params.id })
        if(!profile) return res.status(404).json({"message" : "This user's profile does not exists"})

        await Profile.deleteOne({ _id : req.params.id })
         res.status(200).json({"message" : "Profile deleted successfully"})

    } catch (error) {
         res.status(500).send({ "message" : "Server error"})
    }
})


module.exports = router
 