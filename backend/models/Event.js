const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true,
    enum: ['Güz Yarıyılı', 'Bahar Yarıyılı']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('event', EventSchema);