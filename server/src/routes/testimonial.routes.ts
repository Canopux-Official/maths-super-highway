import express from 'express';
import { createTestimonial, deleteTestimonial, getMyTestimonialForCourse, getPageTestimonialsPaginated, updateTestimonial } from '../controllers/testimonial.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create',verifyAuth,verifyRole(["student"]),createTestimonial);
router.patch('/update/:id',verifyAuth,verifyRole(["student"]),updateTestimonial);
router.delete('/delete/:id',verifyAuth,verifyRole(["student"]),deleteTestimonial);



router.get('/get-my-testimonial-for-course/:courseId',verifyAuth,verifyRole(["student"]),getMyTestimonialForCourse);
router.get("/get-page-testimonials-paginated/:id", verifyAuth,verifyRole(["student"]), getPageTestimonialsPaginated);

export default router;