import express  from 'express';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import { userDashboard } from '../controllers/dashboard.user.controller';
const router = express.Router();

router.get('/:userId',verifyAuth,verifyRole(["student"]),userDashboard)

export default router;
