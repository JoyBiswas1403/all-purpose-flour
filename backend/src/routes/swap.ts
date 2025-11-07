import express from 'express';
import { SwapController } from '../controllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // All swap routes require authentication

router.get('/swappable-slots', SwapController.getSwappableSlots);
router.post('/swap-request', SwapController.createSwapRequest);
router.post('/swap-response/:requestId', SwapController.respondToSwapRequest);
router.get('/incoming-requests', SwapController.getIncomingRequests);
router.get('/outgoing-requests', SwapController.getOutgoingRequests);

export default router;