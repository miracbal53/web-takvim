const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // CORS paketini ekleyin

const app = express();

console.log('Starting server...');

// Connect Database
connectDB()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors()); // CORS'u etkinleştirin
console.log('Middleware initialized...');

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/adminAuth', require('./routes/api/adminAuth'));
app.use('/api/adminRegister', require('./routes/api/adminRegister'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/calendars', require('./routes/api/calendars')); // Ensure this line is present
console.log('Routes defined...');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));