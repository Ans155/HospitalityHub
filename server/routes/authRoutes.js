const express = require('express');
const passport = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const router = express.Router();

User.collection.createIndex({ userEmail: 1 });
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
router.post('/login', async (req, res) => {
  try {
    const { userEmail, password, role } = req.body;
    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.userEmail, role: user.role }, 'secret123', { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
