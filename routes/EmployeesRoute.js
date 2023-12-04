import express from "express";
import {
    getEmployee,
    getEmployeeById,    
    saveEmployeeAndUser,
    updateEmployee,
    deleteEmployee
} from "../controllers/EmployeesController.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/api/v1/employee',  verifyUser, getEmployee);
router.get('/api/v1/employee/:uuid',  verifyUser, adminOnly, getEmployeeById);
router.post('/api/v1/employee/user/create',  verifyUser, adminOnly, saveEmployeeAndUser);
router.patch('/api/v1/employee/update/:uuid',  verifyUser, adminOnly, updateEmployee);
router.delete('/api/v1/employee/delete/:uuid',  verifyUser, adminOnly, deleteEmployee);

export default router;  