const mongoose = require('mongoose');
const dotenv = require('dotenv');

// HANDLING UNCAUGHT EXCEPTIONS
// (All errors that occur in our synchronous code, these errors are not caught by try...catch blocks or promise rejection handlers. These errors happen when a promise is rejected without handling the error)
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// mongoose.connect() -> returns a promise that resolves to a Mongoose Connection object when the connection to the database is successfully established
mongoose.connect(DB, {}).then(() => {
  // .connections -> connections array, which contains details about the established connection(s)
  // console.log(con.connections);
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
// app.listen() -> returns an instance of the HTTP server created by Node.js
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

// GLOBALLY HANDLING UNHANDLED PROMISE REJECTIONS
// process -> global object in Node.js that provides information about and control over the current Node.js process
// process.on(event, listener) -> method that attaches an event listener to the process
// unhandledRejection: An event that is emitted when a promise is rejected, but no .catch() handler is attached to handle the rejection.
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  // process.exit() -> method in Node.js used to terminate the current process and provide an exit code
  // server.close() -> used to stop the server from accepting new connections and to gracefully shut it down
  //   it will wait for any ongoing requests to finish before shutting down completely
  server.close(() => {
    // 1 -> process exited due to an error or failure
    // 0 -> signifies successful completion of the process
    process.exit(1);
  });
});
