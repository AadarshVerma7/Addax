import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/google", authController.googleLogin);

router.get("/me", protect, authController.getMe);

router.post("/logout", protect, authController.logout);

export default router;