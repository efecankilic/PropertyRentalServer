const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '1h' },
        (error, token) => {
          if (error) throw error;
          res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', secure: false }).json({ message: 'Login successful' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '12h' },
        (error, token) => {
          if (error) throw error;
          res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', secure: false }).json({ message: 'Login successful' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post('/logout', (req, res) => {

  res.clearCookie('token');

  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
