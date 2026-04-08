import { Router } from 'express';
import { validateCreateCourse, validateMongoId, validateUpdateCourse } from '../validation/course.validation';
import { createCourse, deleteCourse, getAdminPageDetails, getAdminSubItems, updateCourse } from '../controllers/courses.admin.controller';

const router = Router();

// GET /api/courses          → full nested tree
router.get('/:id', getAdminSubItems);

// GET /api/courses/:id      → single course with immediate children
router.get('/getpage/:id', validateMongoId, getAdminPageDetails);

// POST /api/courses         → create
router.post('/create', validateCreateCourse, createCourse);

// PATCH /api/courses/:id    → update / move
router.patch('/update/:id', validateUpdateCourse, updateCourse);

// DELETE /api/courses/:id   → hard delete course + all descendants
router.delete('/delete/:id', validateMongoId, deleteCourse);

export default router;