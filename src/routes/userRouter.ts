import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import authMiddlewares from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.patch("/update-me", authMiddlewares.protect, userController.updateMe);

export default router;
