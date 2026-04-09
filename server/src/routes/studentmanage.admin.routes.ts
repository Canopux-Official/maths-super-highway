import express from 'express';
import { deleteUser, getAllUsers, updateUserByAdmin } from '../controllers/studentmanage.admin.controller';

const router = express.Router();

// Matches the Frontend userService calls
router.get('/', getAllUsers);
router.put('/update-status/:id', updateUserByAdmin);
router.delete('/delete-user/:id', deleteUser);

export default router;