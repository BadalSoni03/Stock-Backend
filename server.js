require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectToDB = require('./config/db.config');

connectToDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(express.json());

const router = require('./route/index.route');
app.use('/api', router);

app.listen(PORT, () => console.log('app started'));