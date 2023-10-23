import express from "express";
import {
    getPosition,
    getPositionByid,
    createPosition,
    updatePosition,
    deletePosition
} from "../controllers/PositionController.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/api/v1/employee/position/get', verifyUser, adminOnly, getPosition);
router.get('/api/v1/employee/position/:id', verifyUser, adminOnly, getPositionByid);
router.post('/api/v1/employee/position/create', verifyUser, adminOnly, createPosition);
router.patch('/api/v1/employee/position/update/:id', verifyUser, adminOnly, updatePosition);
router.delete('/api/v1/employee/position/delete/:id', verifyUser, adminOnly, deletePosition);

export default router;