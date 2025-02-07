import express from 'express';
import { addTask, getTasks, updateTask, deleteTask } from '../controller/taskController.js';
import { requireSignIn } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', requireSignIn, addTask);
router.get('/', requireSignIn, getTasks);
router.put('/update:id', requireSignIn, updateTask);
router.delete('/delete:id', requireSignIn, deleteTask);

export default router;
