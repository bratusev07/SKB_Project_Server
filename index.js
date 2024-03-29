require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers/user-router');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();

app.use(express.json());
app.use('/api', router);
app.use(errorMiddleware);

async function createCode() {
    const code = Math.trunc(Math.random() * 8999 + 1000);
    if(process.env.VERIFICATION_CODE !== '1111') process.env.VERIFICATION_CODE_PREV = process.env.VERIFICATION_CODE;
    process.env.VERIFICATION_CODE = code;
}

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        setInterval(createCode, 60000);
        app.listen(process.env.PORT || 5000);
    } catch (e) {
        console.log(e);
    }
}

module.exports = app

start();