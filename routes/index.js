const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const User = require('../models/User');
const Address = require('../models/Address');
const { Verify } = require("../middlewares");
const jwt = require('jsonwebtoken')




//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

// //------------ Dashboard Route ------------//
// router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dash', {
//     name: req.user.name
// }));
// // Route to get user data
// router.get('/userData', ensureAuthenticated, async (req, res) => {
//     try {
//       // Fetch user data from the User model using the req.user.id property
//       const user = await User.findById(req.user.id);
      
//       // Return the user data as the response
//       res.status(200).json(user);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   });

  // Route to find user by email
router.get('/findUserByEmail/:email', Verify,async (req, res) => {
    try {
      // Find user by email using the findOne method
      const user = await User.findOne({ email: req.params.email });
  
      // If user is not found, return a 404 status code with an error message
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Return the user data as the response
      res.status(200).json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/findUserByToken/:token', Verify,async (req, res) => {
    try {
      jwt.verify(req.params.token, process.env.SECRET_KEY||"jwtactive987", async (err, authData) => {
        // console.log("authdata",authData.user);
        if (err != null) {
            console.log(err)
            res.status(500).send(err);
        } else {
            const {email}=authData.user;
            const user = await User.findOne({ email: email });
  
      // If user is not found, return a 404 status code with an error message
          if (!user) {
           return res.status(404).json({ msg: 'User not found' });
           }
  
          // Return the user data as the response
         res.status(200).json(user);
        }
        
    }
    )
   
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/findUser/:address', Verify,async (req, res) => {
    try {
     
    

    const add = await Address.findOne({ address:req.params.address });
    
    const user = await User.findOne({ email: add.email });
    
    
    res.status(200).json(user);


    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  

// Endpoint to handle registering an address for a user
router.post('/registerAddress',Verify, async (req, res) => {
  try {
    const { email, address } = req.body;

    // Check if the address already exists
    const existingUser = await Address.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Address already exists' });
    }

    // Create a new user with the provided email and address
    const newUser = new Address({
      email,
      address,
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({ message: 'Address registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;