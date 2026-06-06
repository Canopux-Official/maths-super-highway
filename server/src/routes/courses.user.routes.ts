import express  from 'express';
import { getEnrolledCount, getMyEnrolledCourses, getUserPageDetails, getUserSubItems } from '../controllers/courses.user.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import { streamDrivePdf } from '../controllers/courses.admin.controller';
const router = express.Router();

router.get('/myenroll-courses',verifyAuth,verifyRole(["student"]),getMyEnrolledCourses);
router.get('/:id',verifyAuth,verifyRole(["student"]),getUserSubItems);
router.get('/getpage/:id',verifyAuth,verifyRole(["student"]),getUserPageDetails);
router.get('/enrolled-count/:id',verifyAuth,verifyRole(["student"]),getEnrolledCount);

router.get('/stream/pdf/:fileId',verifyAuth,verifyRole(["student"]),streamDrivePdf );



export default router;