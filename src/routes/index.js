import { Router } from 'express';
import healthRoutes from './health.routes.js';
import userRoutes from './user.routes.js';
import videoRoutes from './video.routes.js';
import contactRoutes from './contact.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/videos', videoRoutes);
router.use('/contact', contactRoutes);

export default router;
