const express = require('express');
const passport = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User'); // Import your User model

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const dummy = await User.findOne({userEmail});
    if(dummy)
    {
      return res.status(500).json({message: 'Email already exists'});
    }
    const user = new User({ userEmail, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log()
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', (req, res, next) => {
    const { userEmail, password, role } = req.body;
    //console.log(password);
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
        console.log(user);
      return res.status(401).json({ message: info.message });
    }

    const token = jwt.sign({ id: user._id, email: user.userEmail, role: user.role}, 'secret123', { expiresIn: '1h' });
    return res.json({ token });
  })(req, res, next);
});

module.exports = router;
