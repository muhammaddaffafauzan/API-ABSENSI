import express from "express";
import {Login, Me} from "../controllers/AuthController.js";
import { verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

// router.get('/api/v1/auth/token', token);
router.get('/api/v1/auth/me', verifyUser, Me);
router.post('/api/v1/auth/login', Login);

export default router;