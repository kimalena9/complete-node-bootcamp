const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express.json() -> middleware (function that can modify the incoming request data)
// parses JSON body and converts it into a JavaScript object, the resulting object is attached to the req.body
app.use(express.json());
// serves static files from a specified directory
// makes the public folder (relative to the root directory) available to serve static files -> it allows it to be accessible to the client
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

// connects the routes defined in tourRoutes.js to the Express application
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// "catch-all" route handler, the final middleware to handle all incoming requests that do not match any of the predefined routes in the application
// applies to all HTTP methods for a specific route or path
app.all('*', (req, res, next) => {
  // req.url -> path after any router has been applied
  // req.originalUrl -> represents the original path of the request, regardless of routing
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
