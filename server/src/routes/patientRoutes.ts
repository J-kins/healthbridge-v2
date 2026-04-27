import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router: Router = express.Router();

// All patient routes require authentication and patient role
router.use(authMiddleware);
router.use(requireRole(['patient']));

// GET /api/patient/dashboard
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // TODO: Implement dashboard logic
    res.json({ message: 'Patient dashboard', userId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patient/appointments
router.get('/appointments', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // TODO: Implement appointments logic
    res.json({ message: 'Patient appointments', userId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patient/saved-clinics
router.get('/saved-clinics', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // TODO: Implement saved clinics logic
    res.json({ message: 'Patient saved clinics', userId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
