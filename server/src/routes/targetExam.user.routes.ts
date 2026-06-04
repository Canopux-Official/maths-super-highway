import express from 'express';
import { getActiveTargetExams } from '../controllers/targetExam.user.controller';

const router = express.Router();

router.get('/', getActiveTargetExams);

export default router;
