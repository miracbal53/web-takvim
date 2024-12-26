const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Calendar = require('../models/Calendar');
const User = require('../models/User');
const app = express();

app.use(express.json());
app.use('/api/calendars', require('../routes/api/calendars'));

const db = config.get('mongoURI');

describe('Calendar API', () => {
  let token;
  let expect;

  before(async () => {
    await mongoose.connect(db);
    await User.deleteMany({ email: 'admin@example.com' }); // Add this line to delete existing users
    const user = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin'
    });
    await user.save();
    token = jwt.sign({ user: { id: user.id, role: user.role } }, config.get('jwtSecret'), { expiresIn: '1h' });

    // Dynamically import chai
    const chai = await import('chai');
    expect = chai.expect;
  });

  after(async () => {
    await User.deleteMany({});
    await Calendar.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create a new calendar', async () => {
    const res = await request(app)
      .post('/api/calendars')
      .set('x-auth-token', token)
      .send({ name: 'Test Calendar', year: '2025-2026' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', 'Test Calendar');
    expect(res.body.year).to.have.property('start', '2025');
    expect(res.body.year).to.have.property('end', '2026');
  });

  it('should get all calendars', async () => {
    const res = await request(app).get('/api/calendars');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});