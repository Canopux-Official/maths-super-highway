import express from 'express';
import {
    adminDeleteTestimonial, createTestimonial, getMyFeedback, getNodeReviews, getReviewStats,
    setLandingVisibility, updateTestimonial,
} from '../controllers/testimonial.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import { validateMongoId, handleValidation } from '../validation/course.validation';

const router = express.Router();
const student = [verifyAuth, verifyRole(['student'])];
const admin = [verifyAuth, verifyRole(['admin'])];

// Student: list mine, create, edit. There is no student delete on purpose.
router.get('/mine', ...student, getMyFeedback);
router.post('/create', ...student, createTestimonial);
router.patch('/update/:id', ...student, validateMongoId, handleValidation, updateTestimonial);

// Admin
router.get('/admin/stats', ...admin, getReviewStats);
router.get('/admin/node/:id', ...admin, validateMongoId, handleValidation, getNodeReviews);
router.patch('/admin/:id/visibility', ...admin, validateMongoId, handleValidation, setLandingVisibility);
router.delete('/admin/:id', ...admin, validateMongoId, handleValidation, adminDeleteTestimonial);

export default router;