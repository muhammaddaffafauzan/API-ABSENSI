import express from "express";
import { 
  getUsers,
  getUsersById,
  createUsers,
  updateUsers,
  updatePassUser,
  deleteUsers
 } from "../controllers/UsersController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/api/v1/users', adminOnly, verifyUser,  getUsers);
router.get('/api/v1/users/:uuid', adminOnly, verifyUser,  getUsersById);
router.post('/api/v1/users/add', createUsers);
router.patch('/api/v1/users/update/:uuid', adminOnly, verifyUser, updateUsers);
router.patch('/api/v1/users/updatePass',  verifyUser, updatePassUser);
router.delete('/api/v1/users/destroy/:uuid', adminOnly, verifyUser, deleteUsers);

export default router;