import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import bcrypt from "bcryptjs";

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user: any, statuscode: number, res: Response) => {
    const token = signToken(user._id);

    user.password = undefined;
    res.status(statuscode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

const signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newUser = await User.create(req.body);

        createSendToken(newUser, 201, res);
    }
);

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exists
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({ email });

    // verify if password is correct
    //COMPARE PASSWORD FUNCTION WRITTEN IN USER MODEL
    const isCorrect = await bcrypt.compare(password, user?.password as string);
    console.log({ password, userPass: user?.password });

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
        return next(new AppError("Incorrect email or password!", 401));
    }
    // if everything is okay send token to the client
    createSendToken(user, 200, res);
});

export default { signup, login };
