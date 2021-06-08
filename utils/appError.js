class AppError extends Error {
  constructor(messsage, statusCode) {
    super(messsage);
    this.statusCode = statusCode;
    this.status = "fail";
    this.isOperational = true;

    Error.captureStackTrace(this,this.constructor);
  }
}

module.exports = AppError;
