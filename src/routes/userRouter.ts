import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/", userController.createCurrentUser);

export default router;
