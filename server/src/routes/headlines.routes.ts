import express from 'express';
import { createHeadline, deleteHeadline, getHeadlines, updateHeadline } from '../controllers/headlines.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create',verifyAuth,verifyRole(["admin"]),createHeadline);
router.patch('/update/:id',verifyAuth,verifyRole(["admin"]),updateHeadline);
router.delete('/delete/:id',verifyAuth,verifyRole(["admin"]),deleteHeadline);

router.get('/',getHeadlines);

export default router;