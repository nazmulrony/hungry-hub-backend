import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface UserType {
    name: string;
    email: string;
    password: string;
    photo?: string;
    addressLine1?: string;
    city?: string;
    country?: string;
    isPasswordCorrect(
        inputPassword: string,
        userPassword: string
    ): Promise<boolean>;
}

const { Schema } = mongoose;
const userSchema = new Schema<UserType>({
    name: {
        type: String,
        required: [true, "Please tell us your name."],
    },
    email: {
        type: String,
        required: [true, "Please provide your email."],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password."],
        minLength: 8,
    },
    photo: {
        type: String,
    },
    addressLine1: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
});

// middleware to check if both password and the confirm passwords are same
userSchema.pre("save", async function (next) {
    // Only runs this function if the password was actually modified
    if (!this.isModified("password")) return next();
    // Hashing the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

// Instance method
//METHOD CHECK if the password is correct during sign in or update password
userSchema.methods.isPasswordCorrect = async function (
    inputPassword: string,
    userPassword: string
) {
    return await bcrypt.compare(inputPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
