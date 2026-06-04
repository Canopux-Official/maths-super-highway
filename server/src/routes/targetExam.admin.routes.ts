import express from 'express';
import { getTargetExams, createTargetExam, updateTargetExam, deleteTargetExam } from '../controllers/targetExam.admin.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(verifyAuth, verifyRole(['admin']));

router.get('/', getTargetExams);
router.post('/', createTargetExam);
router.put('/:id', updateTargetExam);
router.delete('/:id', deleteTargetExam);

export default router;
