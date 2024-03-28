import { NextFunction, Request, Response } from "express";
import jwt, { VerifyOptions } from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import User, { UserType } from "../models/userModel";

declare global {
    namespace Express {
        interface Request {
            user: UserType;
        }
    }
}

type VerifyFunction = (
    token: string,
    secretOrPublicKey: jwt.Secret,
    options?: VerifyOptions
) => Promise<any>;

const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1) Getting the token and check if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(
                new AppError(
                    "You are not logged in. Please login to get access",
                    401
                )
            );
        }

        // 2) Verify the token
        const promisifiedVerify: VerifyFunction = promisify(jwt.verify);
        // promisified to catch error in catchAsync function if there any error occurs during verifying
        const decoded = await promisifiedVerify(
            token,
            process.env.JWT_SECRET as string
        );

        // 3) Check if user still exists (in case the user is deleted as the token is issued)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
                new AppError(
                    "The user belonging to this token is no longer exists",
                    401
                )
            );
        }

        // 4) Check if user changed the password after the token was issued
        // if (await currentUser.isPasswordChangedAfter(decoded.iat)) {
        //     return next(
        //         new AppError(
        //             "Password recently changed. Please login again.",
        //             401
        //         )
        //     );
        // }

        req.user = currentUser;
        next();
    }
);

export default { protect };
