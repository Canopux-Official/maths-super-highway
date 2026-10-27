import express from 'express';
import { getMySelections, updateMySelections } from '../controllers/courses.user.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/mine', verifyAuth, verifyRole(['student']), getMySelections);
router.post('/bulk', verifyAuth, verifyRole(['student']), updateMySelections);

export default router;