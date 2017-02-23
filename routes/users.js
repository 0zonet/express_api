const express = require('express');
const router = express.Router();
const User = require('../lib/model/user');
const config = require('../lib/config/config');
const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = config.secret;


function  encrypt(text){
    let cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}


router.post('/', function(req, res, next) {
    if(!req.body){
        res.status(403)
           .json({error: true,message : "Body empty"});
    }

    let _user = req.body;

    User.findOne({username : _user.username})
        .then((user)=>{
            if(user){
                res.status(200)
                .json({error: true, message: 'El usuario ya existe'});
            }else{
                new User({
                    username: _user.username,
                    password: encrypt(_user.password)
                }).save().then((newuser)=>{
                    res.status(201).json({user : newuser});
                }).catch((newerr)=> res.status(403).json({error: true, message : newerr}));
            }
        }).catch((err)=> res.status(403).json({error: true, message : err}));

});

module.exports = router;
