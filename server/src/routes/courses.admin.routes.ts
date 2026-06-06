import { Router } from 'express';
import { validateCreateCourse, validateMongoId, validateUpdateCourse } from '../validation/course.validation';
import { createCourse, deleteCourse, getAdminPageDetails, getAdminSubItems, updateCourse, getEnrolledStudentsExport, uploadCourseImage, deleteCourseImage, streamDrivePdf } from '../controllers/courses.admin.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import { getEnrolledCount } from '../controllers/courses.user.controller';
import upload from '../middlewares/upload.middleware';

const router = Router();

// GET /api/courses          → full nested tree
router.get('/:id',verifyAuth,verifyRole((["admin"])), getAdminSubItems);

// GET /api/courses/:id      → single course with immediate children
router.get('/getpage/:id', verifyAuth,verifyRole((["admin"])),validateMongoId, getAdminPageDetails);

// POST /api/courses         → create
router.post('/create',verifyAuth,verifyRole(["admin"]), validateCreateCourse, createCourse);

// PATCH /api/courses/:id    → update / move
router.patch('/update/:id',verifyAuth,verifyRole(["admin"]), validateUpdateCourse, updateCourse);

// DELETE /api/courses/:id   → hard delete course + all descendants
router.delete('/delete/:id',verifyAuth,verifyRole(["admin"]), validateMongoId, deleteCourse);

router.get('/enrolled-count/:id',verifyAuth,verifyRole(["admin"]),validateMongoId,getEnrolledCount);
router.get('/enrolled-students/:id',verifyAuth,verifyRole(["admin"]),validateMongoId,getEnrolledStudentsExport);

// use to upload images
router.post('/upload-image',verifyAuth,verifyRole(["admin"]),upload.single('image'), uploadCourseImage);

// use to delete upload images
router.delete('/image/:publicId',verifyAuth,verifyRole(["admin"]), deleteCourseImage);

router.get('/stream/pdf/:fileId',verifyAuth,verifyRole(["admin"]),streamDrivePdf );

export default router;