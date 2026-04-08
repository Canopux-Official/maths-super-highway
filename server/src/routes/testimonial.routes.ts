import express from 'express';
import { createTestimonial, deleteTestimonial, getLandingPageTestimonials, updateTestimonial } from '../controllers/testimonial.controller';

const router = express.Router();

router.post('/create',createTestimonial);
router.patch('/update/:id',updateTestimonial);
router.delete('/delete/:id',deleteTestimonial);

router.get('/',getLandingPageTestimonials);

export default router;