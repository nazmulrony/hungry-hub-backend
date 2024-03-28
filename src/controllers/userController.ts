import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import AppError from "../utils/appError";
import { filterObj } from "../utils/filterObj";

const updateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.password) {
            return next(
                new AppError(
                    "You can not use this route for password updates",
                    400
                )
            );
        }

        const filteredBody = filterObj(
            req.body,
            "name",
            "addressLine1",
            "city",
            "Country"
        );
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            filteredBody,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: "success",
            data: {
                user: updatedUser,
            },
        });
    }
);

export default { updateMe };
