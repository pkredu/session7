var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');

// set up local-node-Storage
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

// secret key - config.js

var config = require('../config');
var userModel = require('../user/User');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());


router.post('/register',(req,res)=>{
    // password to be hashed
    // create user
     // genrated token
    var hashedPass =  bcrypt.hashSync(req.body.password,9);

    userModel.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPass,
    })
    .then((registerdUser)=>{
        var token = jwt.sign({id:registerdUser._id},config.secretSalt,{
            expiresIn : 3600
        })
        // res.status(201).send({msg:"successfull registration"});
        res.render('index',{error:'error',msg:'msg'});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send('error in registration')
    })
})

router.post('/login',(req,res)=>{
    // validate login 
       // validate password
    // generate token

    userModel.findOne({email:req.body.email})
    .then((userFound)=>{
        const validUser = bcrypt.compareSync(req.body.password,userFound.password);
        if(!validUser){
            return res.status(401).send({auth:false,token:null,msg:'authentication failed'})
        }
        console.log(userFound);
        var newToken = jwt.sign({id: userFound._id},config.secretSalt,{
            expiresIn : 3600
        })
        localStorage.setItem('authToken',newToken)
        res.status(200).send({auth:true, token:newToken})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send('user does not exist')
    })
})

router.get('/loggedInUser',(req,res)=>{
    // get token from request
    // verify token
    
        // perform operation crud / mongo

    //var token = req.headers['x-access-token'];
    // save it in client
    // read form stroage in client 
    // send in headeres
    var token = localStorage.getItem('authToken');
    if(!token){
        return res.status(401).send({auth:false}) ;
    }
    jwt.verify(token,config.secretSalt, (err,validatedToken)=>{
        if(err){
            console.log(`ERROR in JWT - \n ${err}`);
            return res.status(500).send('failed to authenticate');
        }
        userModel.findById(validatedToken.id,{password :0})
        .then(userDetails =>{
            console.log(`INFO - user found ${userDetails.name}`)
            res.status(200).send(userDetails);
        })
        .catch(err=>{
            console.log(`ERROR in finding user details - \n ${err}`);
        })
    })
})

router.get('/logout',(req,res)=>{
    localStorage.removeItem('authToken');
    res.redirect('/');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

module.exports = router;
