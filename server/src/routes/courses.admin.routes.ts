import { Router } from 'express';
import {
    handleValidation, validateCreateCourse, validateMongoId, validateMoveCourse, validateUpdateCourse,
} from '../validation/course.validation';
import {
    createCourse, deleteCourse, getAdminTree, getDeletePreview, getEnrolledStudentsExport,
    getSelectionCounts, moveCourse, updateCourse,
} from '../controllers/courses.admin.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import { getEnrolledCount } from '../controllers/courses.user.controller';

const router = Router();
const admin = [verifyAuth, verifyRole(['admin'])];

router.get('/tree', ...admin, getAdminTree);
router.get('/stats', ...admin, getSelectionCounts);

router.post('/create', ...admin, validateCreateCourse, handleValidation, createCourse);
router.patch('/update/:id', ...admin, validateUpdateCourse, handleValidation, updateCourse);
router.patch('/move/:id', ...admin, validateMoveCourse, handleValidation, moveCourse);

router.get('/delete-preview/:id', ...admin, validateMongoId, handleValidation, getDeletePreview);
router.delete('/delete/:id', ...admin, validateMongoId, handleValidation, deleteCourse);

router.get('/enrolled-count/:id', ...admin, validateMongoId, handleValidation, getEnrolledCount);
router.get('/enrolled-students/:id', ...admin, validateMongoId, handleValidation, getEnrolledStudentsExport);

export default router;