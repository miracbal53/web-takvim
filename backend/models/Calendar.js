// models/Calendar.js
const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  year: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Calendar', CalendarSchema);