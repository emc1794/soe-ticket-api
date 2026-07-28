import { Router } from 'express';
import ticketsRoutes from './tickets.routes';
import ordersRoutes from './orders.routes';

const router = Router();

router.use('/tickets', ticketsRoutes);
router.use('/orders', ordersRoutes);

export default router;
