import { Router } from 'express';
import { listVideos, createVideo, incrementView } from '../controllers/video.controller.js';

const router = Router();

router.get('/', listVideos);
router.post('/', createVideo);
router.post('/:id/view', incrementView);

export default router;
