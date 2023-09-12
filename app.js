require('dotenv').config({path: './.env'});
const express = require('express');

const createError = require('http-errors');

const app = express();
const PORT = process.env.PORT || 3000;

const personsRouter = require('./routes/index');

// Rate limiter
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(limiter);


// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/api', personsRouter);

app.set('trust proxy', 1)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message });
});




app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
