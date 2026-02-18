const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later"
  }
  // if error is an instance of one of the classes then we execute the following block.
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // if not
  // we will create custom error object.
  // becasue will set multiple if statements.
  if (err.code && err.code === 11000) {
    // we access the keyValue property and add it into customError.message as well as statusCode - samething
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  };
  // checking for validation error
  if (err.name === "ValidationError") {
    // We wanna get all the values for the keys in the "errors" object.
    customError.msg = Object.values(err.errors).map((item) => item.message).join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // checking for CastError
  if (err.name === "CastError") {
    customError["msg"] = `No item found with id : ${err.value}`;
    customError["statusCode"] = StatusCodes.NOT_FOUND;
  };
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
