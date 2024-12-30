class AppError extends Error {
  constructor(message, statusCode) {
    // passes the message to the parent Error class and sets the message property for the AppError instance
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Error.captureStackTrace -> parameters (error object instance which is AppError in this case, the function we are excluding from the stack trace which is this.constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error.captureStackTrace(this, this.constructor) customizes the error stack trace by attaching it to the current error instance and excluding the custom error class's constructor from the trace. This results in a cleaner, more relevant stack trace that helps in debugging.

module.exports = AppError;
