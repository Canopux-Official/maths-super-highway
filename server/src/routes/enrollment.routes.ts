import express from 'express';
import { checkEnrollment, enrollInCourse, unenrollFromCourse } from '../controllers/enrollment.controller';

const router = express.Router();

router.post('/enroll',enrollInCourse);
router.delete('/unenroll',unenrollFromCourse);

router.get("/check-enrollment/:courseId", checkEnrollment);

export default router;