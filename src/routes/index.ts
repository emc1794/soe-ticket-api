import { Router } from 'express';
import userRoutes from '../modules/users/routes/user.routes';
import authRoutes from '../modules/auth/routes/auth.routes';
import eventsRoutes from '../modules/events/routes/events.routes';
import venuesRoutes from '../modules/venues/routes/venues.routes';
import ticketsRoutes from '../modules/tickets/routes/tickets.routes';
import ordersRoutes from '../modules/orders/routes/orders.routes';
import paymentsRoutes from '../modules/payments/routes/payments.routes';
import promotionsRoutes from '../modules/promotions/routes/promotions.routes';
import notificationsRoutes from '../modules/notifications/routes/notifications.routes';
import fraudRoutes from '../modules/fraud/routes/fraud.routes';
import searchRoutes from '../modules/search/routes/search.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/venues', venuesRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/promotions', promotionsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/fraud', fraudRoutes);
router.use('/search', searchRoutes);

export default router;
