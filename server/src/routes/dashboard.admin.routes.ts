import express  from 'express';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';
import { adminDashboard } from '../controllers/dashboard.admin.controller';
const router = express.Router();

router.get('/',verifyAuth,verifyRole(["admin"]),adminDashboard)

export default router;