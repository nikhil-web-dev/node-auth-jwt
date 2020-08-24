const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


const {check, validationResult} = require('express-validator')
const User = require('../models/Users')

router.get('/', (req, res) => res.send('Users Route'))

router.post('/', [
    check('username', 'Username is requird').not().isEmpty(),
    check('email', 'Please Provide valid email').isEmail(),
    check('password','Provide password of minimum 6 characters').isLength({min:6})
],async(req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({msg: errors.array()})
    }

    try{
        const{username, email,password} = req.body

        //see if user exists
        let user= await User.findOne({
            $or: [
                   { 'username' : username },
                   { 'email': email }
                 ]
          })
      
        
        if(user) return res.status(400).json({error: [{msg:'user already exists'}]})

        //create instance
        user = new User({
            username, email, password
        })

        //encrypt password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        //----jsonwebtoken----


        //create payload
        const payload = {
            user:{
                id: user.id
            }
        }

        //sign json
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600},
        (err, token) => {
            if(err) throw err
            res.json({token})
        }
        )



    }catch(err){
        console.log(err);
        
    }

}
)
module.exports = router