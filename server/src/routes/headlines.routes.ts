import express from 'express';
import { createHeadline, deleteHeadline, getHeadlines, updateHeadline } from '../controllers/headlines.controller';

const router = express.Router();

router.post('/create',createHeadline);
router.patch('/update/:id',updateHeadline);
router.delete('/delete/:id',deleteHeadline);

router.get('/',getHeadlines);

export default router;