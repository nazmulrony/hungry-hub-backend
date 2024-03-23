import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const handleErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const message = `Duplicate field value: ${Object.values(err.keyValue)[0]}`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;

    return new AppError(message, 400);
};

const handleJwtError = () =>
    new AppError("Invalid token! Please login again.", 401);

const handleJwtExpiredError = () =>
    new AppError("Your token has expired. Pleas login again", 401);

const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: any, res: Response) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        //Programming error or other unknown error: don't leak error details
    } else {
        console.error("ERROR 🔥:", err);
        res.status(err.statusCode).json({
            status: "error",
            message: "Something went very wrong",
        });
    }
};

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "fail";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err, name: err.name };

        if (error.name === "CastError") error = handleErrorDB(error);

        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);

        if (error.name === "JsonWebTokenError") error = handleJwtError();

        if (error.name === "TokenExpiredError") error = handleJwtExpiredError();

        sendErrorProd(error, res);
    }
};

export default errorHandler;
