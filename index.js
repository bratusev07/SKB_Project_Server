require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers/user-router');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = 5000 || process.env.PORT;
const app = express();

app.use(express.json());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log("Server started"));
    } catch (e) {
        console.log(e);
    }
}

start();