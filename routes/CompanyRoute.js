import express from "express";
import {
    getCompany,
    createCompany,
    updateCompany
} from "../controllers/CompanyController.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";
import { limitCompany } from "../middleware/CompanyLimit.js";
const router = express.Router();

router.get('/api/v1/employee/company/get', getCompany);
router.post('/api/v1/employee/company/create',  verifyUser, adminOnly, limitCompany, createCompany);
router.patch('/api/v1/employee/company/update', verifyUser, adminOnly, updateCompany);

export default router;