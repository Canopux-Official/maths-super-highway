import express from 'express';
import { getCourses, getLandingPageTestimonials } from '../controllers/landingPage.controller';
import { getHeadlines } from '../controllers/headlines.controller';
const router = express.Router();



router.get('/get-landing-page-testimonials',getLandingPageTestimonials);

router.get('/get-courses/root',getCourses)

router.get('/get-headlines',getHeadlines)


export default router;