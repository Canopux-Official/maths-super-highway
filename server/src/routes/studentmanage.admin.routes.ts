import express from 'express';
import { deleteUser, getAllUsers, updateUserByAdmin, getUserDetails } from '../controllers/studentmanage.admin.controller';
import { verifyAuth, verifyRole } from '../middlewares/auth.middleware';

const router = express.Router();

// Matches the Frontend userService calls
router.get('/',verifyAuth,verifyRole(["admin"]), getAllUsers);
router.get('/:id',verifyAuth,verifyRole(["admin"]), getUserDetails);
router.put('/update-status/:id',verifyAuth,verifyRole(["admin"]), updateUserByAdmin);
router.delete('/delete-user/:id',verifyAuth,verifyRole(["admin"]), deleteUser);

export default router;