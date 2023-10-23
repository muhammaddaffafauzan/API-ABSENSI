import express from "express";
import {
    getInformation,
    getInformationById,
    sendInformation,
    deleteInformation
} from "../controllers/InformationController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/api/v1/employee/information/get', verifyUser, getInformation);
router.get('/api/v1/employee/information/:id', verifyUser, getInformationById);
router.post('/api/v1/employee/information/send', verifyUser, sendInformation);
router.delete('/api/v1/employee/information/delete/:id', verifyUser, adminOnly, deleteInformation);

export default router;