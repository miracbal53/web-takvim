process.env.NODE_CONFIG_DIR = __dirname + '/../config';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const Admin = require('../models/Admin');

const db = config.get('mongoURI');

const addAdmin = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin';

    let admin = await Admin.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists');
      return;
    }

    admin = new Admin({
      email: adminEmail,
      password: adminPassword
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(adminPassword, salt);

    await admin.save();
    console.log('Admin user created');
    mongoose.disconnect();
  } catch (err) {
    console.error(err.message);
    mongoose.disconnect();
  }
};

addAdmin();