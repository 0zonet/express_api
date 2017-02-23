"use strict"
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../lib/model/user');
const config = require('../lib/config/config');
const router = express.Router();
const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = config.secret;

function  encrypt(text){
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}


router
.post('/', function(req, res, next) {
    if(!req.body){
        res.status(403).json({error : true, message : 'Body empty'});
    }

    let _user = req.body;
    User.findOne({username: _user.username})
        .then((user)=>{
            if(user.password == encrypt(_user.password)){
                let token = jwt.sign(user, config.secret,{
                    expiresIn: '24hr'
                });
                res.status(200)
                  .json({token : token})
            }else{
                res.status(200)
                .json({error: true, message: 'password incorrecta'});
            }
        }).catch((err)=>{
            res.status(403)
                .json({error: true, message : err});
        });
});

module.exports = router;