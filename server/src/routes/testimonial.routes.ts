import express from 'express';
import { createTestimonial, deleteTestimonial, getMyTestimonialForCourse, getPageTestimonialsPaginated, updateTestimonial } from '../controllers/testimonial.controller';

const router = express.Router();

router.post('/create',createTestimonial);
router.patch('/update/:id',updateTestimonial);
router.delete('/delete/:id',deleteTestimonial);



router.get('/get-my-testimonial-for-course/:courseId',getMyTestimonialForCourse)
router.get("/get-page-testimonials-paginated/:id", getPageTestimonialsPaginated);

export default router;