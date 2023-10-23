import express from "express";
import {Login, logout, Me} from "../controllers/AuthController.js";
const router = express.Router();

// router.get('/api/v1/auth/token', token);
router.get('/api/v1/auth/me', Me);
router.post('/api/v1/auth/login', Login);
router.delete('/api/v1/auth/logout', logout);

export default router;