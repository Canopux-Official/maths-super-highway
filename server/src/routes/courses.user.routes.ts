import express  from 'express';
import { getMyEnrolledCourses, getUserPageDetails, getUserSubItems } from '../controllers/courses.user.controller';
const router = express.Router();

router.get('/',getUserSubItems);
router.get('/getpage/:id',getUserPageDetails);
router.get('/myenroll-courses',getMyEnrolledCourses);

export default router;