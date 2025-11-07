import express from 'express';
import { EventController } from '../controllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // All event routes require authentication

router.post('/', EventController.createEvent);
router.get('/', EventController.getUserEvents);
router.patch('/:id/status', EventController.updateEventStatus);
router.delete('/:id', EventController.deleteEvent);

export default router;