import { Router } from 'express';
import { signup, login, verifyLogin, resendLoginOtp, getMe, updateMe } from '../controllers/auth.controller';
import { verifyAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify', verifyLogin);
router.post('/resend-otp', resendLoginOtp);
router.get('/me', verifyAuth, getMe);
router.put('/me', verifyAuth, updateMe);

export default router;
