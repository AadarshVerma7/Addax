import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);
router.get("/me", authMiddleWare, authController.getMe);
router.post("/logout", authMiddleWare, authController.logout);
export default router;
//# sourceMappingURL=auth.routes.js.map