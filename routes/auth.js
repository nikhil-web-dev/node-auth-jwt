const express = require('express')
const router = express.Router()
const config = require('config')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const Users = require('../models/Users')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

router.get('/', auth,async(req, res) => {
  try{
      const user = await Users.findById(req.user.id).select('-password')
      res.json(user)
  }catch(err){
      console.log(err);
      res.status(500).send('Server Error')
      
  }
})




router.post('/',[
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists()
], async(req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({msg: errors.array()})
    }

    try{
        const{username, password} = req.body;

        let user = await User.findOne({username})

        if(!user) return res.status(401).json({error: [{msg: 'Credentials not found'}]})

        //compare password
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.status(400).json({msg:'Credentials not found'})

        //--- jsonwebtoken ---

        //create payload
        const payload = {
            user:{
                id: user.id
            }
        }

        //sign json
        jwt.sign( payload, config.get('jwtSecret'), 
        {expiresIn: 3600},
        (err, token) => {
            if(err) throw err;
            res.json({token})
        }
        )

        
    }catch(err){
        console.log(err.message);
        return res.status(500).send('Server Error')
    }
})



module.exports = router