import express from "express";
import { 
  getUsers,
  getUsersById,
  createUsers,
  updateUsers,
  updatePassUser,
  deleteUsers,
  // resetPassword,
  // changePasswordWithoutToken,
} from "../controllers/UsersController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/v1/users', verifyUser, adminOnly, getUsers);
router.get('/api/v1/users/:uuid', verifyUser, adminOnly, getUsersById);
router.post('/api/v1/users/add', verifyUser, adminOnly, createUsers);
router.patch('/api/v1/users/update/:uuid', verifyUser, adminOnly, updateUsers);
router.patch('/api/v1/users/updatePass', verifyUser, updatePassUser);
router.delete('/api/v1/users/destroy/:uuid', verifyUser, adminOnly, deleteUsers);
// router.post('/api/v1/auth/reset-password', resetPassword);
// router.post('/api/v1/auth/change-password', changePasswordWithoutToken);

export default router;
