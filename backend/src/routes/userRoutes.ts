import express from 'express';
import bodyParser from 'body-parser';
import * as profileControllers from '../controllers/profileControllers';
import * as adminControllers from '../controllers/adminControllers';
import * as authControllers from '../controllers/authControllers';
import * as userControllers from '../controllers/userControllers';
import { authenticateToken } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const jsonParser = bodyParser.json();
const router = express.Router();

// User routes
router.get('/user/:id', profileControllers.getUsers); // Get user by ID
router.put('/user', jsonParser, profileControllers.updateUser); // Update user
router.delete('/user/:id', profileControllers.deleteUser); // Delete user
router.post('/user/upload-photo', upload.single('profileImage'), profileControllers.photoUpload); // Upload photo
router.post('/user/:id/changePassword', profileControllers.changePassword); // Change password

// Common routes
router.post('/register', jsonParser, authControllers.register); // Register
router.post('/login', authControllers.login); // Login
router.post('/logout', authControllers.logout); // Logout
router.post('/refresh-token', authControllers.refreshAccessToken); // Refresh token
router.post('/forgot-password', userControllers.forgotPassword); // Forgot password
router.post('/reset-password', userControllers.resetPassword); // Reset password

// Admin routes
router.get('/admin/users', adminControllers.getUserList); // Get all users
router.get('/admin/user/:id', adminControllers.getUserById); // Get user by ID
router.post('/admin/user', upload.single('profileImage'), adminControllers.createUser); // Create user
router.put('/admin/user', upload.single('profileImage'), adminControllers.updateUser); // Update user
router.delete('/admin/user/:id', adminControllers.deleteUser); // Delete user
router.patch('/admin/user/:id', adminControllers.toggleBlockUser) // Toggle user status
router.patch('/admin/user/verify/:id', adminControllers.userVerification) // User verification

export default router;
