const jwt = require('jsonwebtoken')
const config = require('config')
const express = require('express')

module.exports = function(req, res, next){
    //get token
    const token = req.header('x-auth-header')

    //check if no token available
    if(!token) return res.status(401).json({msg: 'Unauthorized'})

    //verify
    try{
        const decode = jwt.verify(token, config.get('jwtSecret'))
        req.user = decode.user
        next()
    }catch(err){
        return res.status(401).json({msg: 'Invalid Token'})
    }
}