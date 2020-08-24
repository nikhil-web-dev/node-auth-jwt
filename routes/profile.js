const express = require('express')
const router= express.Router()
const User = require('../models/Users')
const auth = require('../middleware/auth')

//get all profiles
router.get('/',auth, async(req, res) => {
    try{
       const users = await User.find()
       res.json(users)
    }catch(err){
        res.send('Server Error')
        console.log(err.message);
        
    }
})


//self profile
router.get('/me', auth, async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch(err){
        res.json('server error')
        console.log(err.message);
        
    }
})

//show profile by id
router.get('/user/:user_id', auth, async(req, res) =>{
    try{
        const user = await User.findOne({ 'username' : req.params.user_id }).select('-password')

        if(!user) return res.status(404).json({msg: 'User Not Found'})

        res.json(user)
    }catch(err){
        console.log(err.message)
        if(err.kind == 'ObjectId') return res.status(400).json({msg:'Profile not found'})
        res.json('Server Error')
        
    }
})

module.exports = router