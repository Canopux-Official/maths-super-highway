import express from 'express';
import { checkEnrollment, enrollInCourse, unenrollFromCourse } from '../controllers/enrollment.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/enroll',verifyAuth,verifyRole(["student"]),enrollInCourse);
router.delete('/unenroll',verifyAuth,verifyRole(["student"]),unenrollFromCourse);

router.get("/check-enrollment/:courseId", verifyAuth,verifyRole(["student"]),checkEnrollment);

export default router;