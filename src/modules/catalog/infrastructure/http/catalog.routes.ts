import { Router } from 'express';
import eventsRoutes from './events.routes';
import venuesRoutes from './venues.routes';
import searchRoutes from './search.routes';

const router = Router();

router.use('/events', eventsRoutes);
router.use('/venues', venuesRoutes);
router.use('/search', searchRoutes);

export default router;
