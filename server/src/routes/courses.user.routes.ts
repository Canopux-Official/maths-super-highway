import express  from 'express';
import { getEnrolledCount, getMyEnrolledCourses, getUserPageDetails, getUserSubItems } from '../controllers/courses.user.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
const router = express.Router();

router.get('/myenroll-courses',verifyAuth,verifyRole(["student"]),getMyEnrolledCourses);
router.get('/:id',verifyAuth,verifyRole(["student"]),getUserSubItems);
router.get('/getpage/:id',verifyAuth,verifyRole(["student"]),getUserPageDetails);
router.get('/enrolled-count/:id',verifyAuth,verifyRole(["student"]),getEnrolledCount);



export default router;