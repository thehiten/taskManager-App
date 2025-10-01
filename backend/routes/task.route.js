import express from 'express';
import authentication from '../middleware/authentication.middleware.js';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} from '../controller/task.controller.js';

const router = express.Router();

// All task routes require authentication
router.use(authentication);

// Task routes
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;

