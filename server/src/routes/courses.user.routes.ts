import express from 'express';
import { getEnrolledCount, getMySelections, getUserTree, markReviewed, updateMySelections } from '../controllers/courses.user.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
const router = express.Router();

const student = [verifyAuth, verifyRole(['student'])];

router.get('/tree', ...student, getUserTree);
router.get('/my-selections', ...student, getMySelections);
router.post('/selections', ...student, updateMySelections);
router.patch('/selections/:id/reviewed', ...student, markReviewed);
router.get('/enrolled-count/:id', ...student, getEnrolledCount);

export default router;