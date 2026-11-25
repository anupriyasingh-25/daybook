import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  toggleTask,
  updateTask
} from '../controllers/taskController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);
router.route('/').get(listTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;
