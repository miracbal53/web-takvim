const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const app = express();

app.use(express.json());
app.use('/api/adminAuth', require('../routes/api/adminAuth'));

const db = config.get('mongoURI');

describe('Admin Auth API', () => {
  let expect;

  before(async () => {
    await mongoose.connect(db);
    const admin = new Admin({
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin', 10)
    });
    await admin.save();

    // Dynamically import chai
    const chai = await import('chai');
    expect = chai.expect;
  });

  after(async () => {
    await Admin.deleteMany({});
    await mongoose.disconnect();
  });

  it('should authenticate admin and return a token', async () => {
    const res = await request(app)
      .post('/api/adminAuth')
      .send({ email: 'admin@gmail.com', password: 'admin' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});