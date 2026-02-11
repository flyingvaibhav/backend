import { Router } from 'express';
import { listVideos, featuredVideos, createVideo, incrementView } from '../controllers/video.controller.js';
import { uploadVideoAndThumbnail } from '../middlewares/upload.js';

const router = Router();

router.get('/', listVideos);
router.get('/featured', featuredVideos);
router.post('/', uploadVideoAndThumbnail, createVideo);
router.post('/:id/view', incrementView);

export default router;
