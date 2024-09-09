require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectToDB = require('./config/db.config');

connectToDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(express.json());


const authRouter = require('./route/v1/auth.route');

app.use('/api/v1/auth/', authRouter);

app.listen(PORT, () => console.log('app started'));