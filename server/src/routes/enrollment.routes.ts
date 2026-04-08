import express from 'express';
import { enrollInCourse, unenrollFromCourse } from '../controllers/enrollment.controller';

const router = express.Router();

router.post('/enroll',enrollInCourse);
router.delete('/unenroll',unenrollFromCourse);

export default router;