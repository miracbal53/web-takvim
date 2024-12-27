const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Event = require('../../models/Event');
const Calendar = require('../../models/Calendar');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// @route   POST api/events
// @desc    Create an event
// @access  Private (Admin only)
router.post(
  '/',
  [auth, admin, [
    check('name', 'Name is required').not().isEmpty(),
    check('semester', 'Semester is required').not().isEmpty(),
    check('calendarId', 'Calendar ID is required').not().isEmpty()
  ]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, semester, startDate, endDate, calendarId } = req.body;

    try {
      const calendar = await Calendar.findById(calendarId);
      if (!calendar) {
        return res.status(404).json({ msg: 'Calendar not found' });
      }

      const newEvent = new Event({
        name,
        semester,
        startDate,
        endDate,
        calendarId
      });

      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { name, semester, startDate, endDate } = req.body;

  const eventFields = {};
  if (name) eventFields.name = name;
  if (semester) eventFields.semester = semester;
  if (startDate) eventFields.startDate = startDate;
  if (endDate) eventFields.endDate = endDate;

  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events
// @desc    Get events by calendarId
// @access  Public
router.get('/', async (req, res) => {
  const { calendarId } = req.query;

  try {
    const events = await Event.find({ calendarId });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;