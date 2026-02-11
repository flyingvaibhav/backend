import { Router } from 'express';
import {
	registerUser,
	loginUser,
	refreshAccessToken,
	logoutUser,
	getProfile,
	updateProfile,
	changePassword,
	listUsers,
	updateUserRole,
	deleteUser,
} from '../controllers/user.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyJWT, logoutUser);

router.get('/me', verifyJWT, getProfile);
router.patch('/me', verifyJWT, updateProfile);
router.patch('/me/password', verifyJWT, changePassword);

router.get('/admin/users', verifyJWT, requireRole('admin'), listUsers);
router.patch('/admin/users/:id/role', verifyJWT, requireRole('admin'), updateUserRole);
router.delete('/admin/users/:id', verifyJWT, requireRole('admin'), deleteUser);

export default router;
