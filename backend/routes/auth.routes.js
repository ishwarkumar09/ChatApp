import express from "express";
import { login, logout, signup, updateUserAvatar  } from "../contorllers/auth.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login",login)

router.post("/logout",logout)
router.post("/update-avatar",protectRoute, updateUserAvatar)

export default router;
