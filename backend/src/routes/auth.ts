import express from 'express';
import { AuthController } from '../controllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticateToken, AuthController.me);

export default router;