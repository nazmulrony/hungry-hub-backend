import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";

const createCurrentUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            return res.status(200).send();
        }
        const newUser = await User.create(req.body);

        return res.status(201).json(newUser.toObject());
    }
);

export default { createCurrentUser };
