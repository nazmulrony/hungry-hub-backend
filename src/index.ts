import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import errorHandler from "./controllers/errorController";
import morgan from "morgan";

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => console.log("Connected to database!"));

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRouter);

app.listen(5000, () => {
    console.log("Server running at port 5000");
});

app.use(errorHandler);
