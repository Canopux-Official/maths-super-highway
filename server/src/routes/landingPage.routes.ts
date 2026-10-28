import express from 'express';
import { getLandingCurriculum, getLandingPageTestimonials } from '../controllers/landingPage.controller';
import { getHeadlines } from '../controllers/headlines.controller';
import { getEnrolledCount } from '../controllers/courses.user.controller';
const router = express.Router();



router.get('/get-landing-page-testimonials', getLandingPageTestimonials);

router.get('/curriculum', getLandingCurriculum);
router.get('/get-headlines', getHeadlines)

router.get('/enrolled-count/:id', getEnrolledCount)


export default router;