const express = require('express');
const router = express.Router();
const { AssignToken } = require("../middlewares");
const User = require('../models/User');
const bcryptjs = require('bcryptjs');



//------------ Importing Controllers ------------//
const authController = require('../controllers/authController')

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

//------------ Register Route ------------//
router.get('/register', (req, res) => res.render('register'));

//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Forgot Password Handle ------------//
router.post('/forgot', authController.forgotPassword);

//------------ Reset Password Handle ------------//
router.post('/reset/:id', authController.resetPassword);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login',async (req,res)=>{
    const { email, password } = req.body;
    console.log("login request recieved: "+ email)
    const user = await User.findOne({ email:email});
    console.log(user)
    if (!user) {
        res.json("No user exists with this email")
    }
    else {
        bcryptjs.compare(password, user.password, (err, valid) => {
            if (err) {
                console.log(err);
                callback(err, null)
                res.json("password checking halted")
            }
            else if (!valid) {
                console.log(valid);
                res.json("Wrong password")
            }
            else {
                
                AssignToken(user, (err, token) => {
                    if (err) res.json("Something bad happened")
                    else {
                       
                        const {name,_id,email,enrollmentNo,BhawanName, Branch,  Year} = user;
                        res.status(400).json({token:token,user:{name,_id,email,enrollmentNo,BhawanName, Branch,  Year}})
                    }
                })
            }

        })
    }
});

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

module.exports = router;