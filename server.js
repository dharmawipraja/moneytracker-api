const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const auth = require('./middlewares/auth')

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Transaction API
const transactions = require('./routes/transactions');
app.use('/api/v1/transactions', auth, transactions);

// IDM API
const idm = require('./routes/idm');
app.use('/api/v1/idm', idm);

// User API
const user = require('./routes/users');
app.use('/api/v1/user', auth, user);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
