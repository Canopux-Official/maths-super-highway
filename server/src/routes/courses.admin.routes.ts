import { Router } from 'express';
import { validateCreateCourse, validateMongoId, validateUpdateCourse } from '../validation/course.validation';
import { createCourse, deleteCourse, getAdminPageDetails, getAdminSubItems, updateCourse } from '../controllers/courses.admin.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

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

export default router;