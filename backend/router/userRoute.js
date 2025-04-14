import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUserRole,
  blockUser,
  unblockUser,
  updateUser,
  createUser,
  getUserById,
} from '../controllers/userController.js';

const userRouter = express.Router();

// USER
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// ADMIN
userRouter.post('/admin', adminLogin);

// ADMIN - USER MANAGEMENT
userRouter.get('/', getAllUsers);              // GET all users
userRouter.post('/', createUser);
userRouter.delete('/:id', deleteUser);            // DELETE user by ID
userRouter.patch('/role/:id', updateUserRole);    // PATCH: update user role
userRouter.patch('/block/:id', blockUser);        // PATCH: block user
userRouter.patch('/unblock/:id', unblockUser);    // PATCH: unblock user
userRouter.put('/:id', updateUser);
userRouter.get('/:id', getUserById);
export default userRouter;
