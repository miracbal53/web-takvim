const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const config = require('config');

// @route   POST api/adminRegister
// @desc    Register admin
// @access  Public
router.post(
  '/',
  [
    check('name', 'İsim gereklidir').not().isEmpty(),
    check('email', 'Lütfen geçerli bir email girin').isEmail(),
    check('password', 'Lütfen 6 veya daha fazla karakterden oluşan bir şifre girin').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Kullanıcı zaten mevcut' }] });
      }

      user = new User({
        name,
        email,
        password,
        role: 'admin'
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Sunucu hatası');
    }
  }
);

module.exports = router;