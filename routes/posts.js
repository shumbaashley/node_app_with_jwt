const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const auth = require('./verifyToken')
const { postValidation, commentValidation } = require('../validation')

// Create a new post
router.post('/', auth, async (req , res) => {
    // Validate post data
    const {error} = postValidation(req.body)
    if(error) return res.status(400).json({"message" : error.details[0].message})

   try {
    const user = await User.findById(req.user.id).select('-password')

    const postDetails = new Post({
        author : user.name,
        avatar : user.avatar,
        title : req.body.title,
        text : req.body.text,
        user : req.user.id,
    })

    const post = await postDetails.save() 
    return res.status(201).send(post)
   } catch (error) {
    return res.status(500).send("Server error")       
   }


})

// Get all posts
router.get('/', auth, async (req , res) => {
    try {
        const posts = await Post.find().sort({date : -1})
        return res.json(posts) 
    } catch (error) {
        return res.status(500).send("Server error")       
    }

})

// Get individual post by id
router.get('/:id', auth, async (req , res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post)  return res.status(404).send("This post does not exist")
    
        return res.json(post)
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send("This post does not exist")
        }
        return res.status(500).send("Server error")       

    }
 
})

// Update a single post 

// Delete a single post
router.delete('/:id', auth, async (req , res) => {

    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).send("This post does not exist")
    
        // check if user deleting the post owns the post
    
        if(post.user.toString() !== req.user.id) return res.status(401).send("You are not allowed to delete this post")
    
        await post.remove()
        return res.json("Post deleted successfully") 
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send("This post does not exist")
        }
        return res.status(500).send("Server error") 
    }

})

// Like a specific post 

router.put('/likes/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).send("Post could not be found!")

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).send("User has already liked this post")
        }

        post.likes.unshift({user : req.user.id})
        await post.save()
        return res.json(post.likes)
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send("This post does not exist")
        }
        return res.status(500).send("Server error") 
    }
})



// Like a specific post 

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).send("Post could not be found!")

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).send("Post has not yet been liked")
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()
        return res.json(post.likes)
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send("This post does not exist")
        }
        return res.status(500).send("Server error") 
    }
})

// Cpmment on a post
router.post('/comment/:id', auth, async (req , res) => {
    // Validate post data
    const {error} = commentValidation(req.body)
    if(error) return res.status(400).json({"message" : error.details[0].message})

   try {
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const newComment = {
        name : user.name,
        avatar : user.avatar,
        text : req.body.text,
        user : req.user.id,
    }

    post.comments.unshift(newComment)
    
    await post.save() 
    
    return res.status(201).send(post.comments)
   
} catch (error) {

    return res.status(500).send("Server error")
   }


})

// Delete a comment
router.delete('/comment/:id/:comment_id', auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).send("Post could not be found!")

        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        if(!comment) return res.status(404).send("Comment could not be found!")

        if(comment.user.toString() !== req.user.id){
            return res.status(401).send("User is not authorized to delete this comment!")
        }

        const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id)

        post.comments.splice(removeIndex, 1)

        await post.save()
        return res.json(post.comments)


    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send("This post does not exist")
        }
        return res.status(500).send("Server error")
    }
})

module.exports = router