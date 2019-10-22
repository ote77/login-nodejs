const express = require('express');
const router = express.Router();
const Login = require('../models/login');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('dotenv/config');

//get back item lists.
router.get('/login', async (req, res) => {
  try {
    const user_data = await Login.findOne({
      "username": req.body.username,
      "password": req.body.password
    });
    if (!user_data) {
      res.status(401).json({
        status: 401,
        message: "Invalid username and password.",
      });
    } else {
      console.log('user_data here');
      console.log(user_data);
      const payload = {
        username: user_data.username
      };
      console.log('<------ payload ------>', payload);
      const token = jwt.sign(payload, process.env.JWT_SCRECT, {
        expiresIn: 60 * 60 * 6 // expires in 6 hours
      });
      res.status(200).json({
        message: "You have succesfully loggedin.",
        token: token
      });
    }
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: "err.",
    });
  }

});


//submit a item.
router.post('/register', async (req, res) => {
  //need to check if username exists.
  console.log(req.body);
  const user = new Login({
    ...req.body
  });
  try {
    const newUser = await user.save();
    console.log(newUser);
    res.json(newUser);
    // console.log('ITEM-[%s] %s added', newUser._id, newUser.username);
  } catch (err) {
    res.json({
      message: err
    });
  }
});


//add auth in routes.
router.get('/use', auth, async (req, res) => {
  console.log('<------ use ------>');
  //need to check if username exists.
  try {
    // const newUser = await user.save();
    // console.log(newUser);
    console.log('<------ x-access-token ------>', req.headers['x-access-token']);
    res.json({
      success: true,
      message: req.headers['x-access-token']
    });
    // console.log('ITEM-[%s] %s added', newUser._id, newUser.username);
  } catch (err) {
    console.log('<------ err ------>', err);
    res.json({
      message: err
    });
  }
});

// test auth check
router.use('/test', (req, res, next) => {
  const token = req.headers['x-access-token'];
  console.log('<------ x-access-token ------>', token);
  if (token) {
    jwt.verify(token, process.env.JWT_SCRECT, (err, decoded) => {
      console.log('<------ decoded ------>\n', decoded);
      if (err) {
        return res.json({
          status: 403,
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        res.status(200).json({
          message: "You have succesfully loggedin with token."
        });
        // next();
      }
    });
  } else {
    return res.json({
      status: 403,
      success: false,
      message: 'No token.'
    });
  }
});


module.exports = router;