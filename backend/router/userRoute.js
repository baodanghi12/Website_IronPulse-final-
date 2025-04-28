import express from 'express';
import {
  loginUser,
  registerUser,
  staffLogin,
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUserRole,
  blockUser,
  unblockUser,
  updateUser,
  createUser,
  getUserById,
  googleLogin,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  verifyResetOtp,
  isAuthenticated,
  resetPassword
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// USER
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/google-login', googleLogin);
userRouter.post('/send-verify-otp', authUser, sendVerifyOtp);
userRouter.post('/verify-account', authUser, verifyEmail);
userRouter.get('/is-auth', authUser, isAuthenticated);
userRouter.post('/send-reset-otp', sendResetOtp);
userRouter.post('/verify-reset-otp', verifyResetOtp);
userRouter.post('/reset-password', resetPassword);

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
