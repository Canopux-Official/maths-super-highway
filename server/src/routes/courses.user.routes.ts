import express  from 'express';
import { getMyEnrolledCourses, getUserPageDetails, getUserSubItems } from '../controllers/courses.user.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
const router = express.Router();

router.get('/myenroll-courses',verifyAuth,verifyRole(["student"]),getMyEnrolledCourses);
router.get('/:id',verifyAuth,verifyRole(["student"]),getUserSubItems);
router.get('/getpage/:id',verifyAuth,verifyRole(["student"]),getUserPageDetails);


export default router;