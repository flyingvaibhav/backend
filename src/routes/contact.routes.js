import { Router } from 'express';
import { createContact, listContacts, updateContactStatus } from '../controllers/contact.controller.js';
import { verifyJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/admin', verifyJWT, requireRole('admin'), listContacts);
router.patch('/:id', verifyJWT, requireRole('admin'), updateContactStatus);
router.post('/', createContact);

export default router;
