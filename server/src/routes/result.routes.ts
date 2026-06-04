import express from 'express';
import { getActiveResults, getAllResults, createResult, updateResult, deleteResult } from '../controllers/result.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import upload from '../middlewares/upload.middleware';

const router = express.Router();

// Public route for Landing Page
router.get('/', getActiveResults);

// Admin routes
router.get('/admin', verifyAuth, verifyRole(['admin']), getAllResults);
router.post('/admin', verifyAuth, verifyRole(['admin']), upload.single('image'), createResult);
router.put('/admin/:id', verifyAuth, verifyRole(['admin']), updateResult);
router.delete('/admin/:id', verifyAuth, verifyRole(['admin']), deleteResult);

export default router;
