import express  from 'express';
import { getMyEnrolledCourses, getUserPageDetails, getUserSubItems } from '../controllers/courses.user.controller';
const router = express.Router();

router.get('/myenroll-courses',getMyEnrolledCourses);
router.get('/:id',getUserSubItems);
router.get('/getpage/:id',getUserPageDetails);


export default router;