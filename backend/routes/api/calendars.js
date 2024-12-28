const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Calendar = require('../../models/Calendar');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// @route   POST api/calendars
// @desc    Create a calendar
// @access  Private (Admin only)
router.post(
  '/',
  [auth, admin, [
    check('name', 'Name is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty()
  ]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, year } = req.body;
    const [start, end] = year.split('-');

    try {
      const newCalendar = new Calendar({
        name,
        year: { start, end }
      });

      const calendar = await newCalendar.save();
      res.json(calendar);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/calendars
// @desc    Get all calendars
// @access  Public
router.get('/', async (req, res) => {
  try {
    const calendars = await Calendar.find();
    res.json(calendars);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/calendars/:id
// @desc    Get calendar by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (!calendar) {
      return res.status(404).json({ msg: 'Calendar not found' });
    }
    res.json(calendar);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Calendar not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;