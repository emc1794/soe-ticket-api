import { Router } from 'express';
import identityRoutes from '../modules/identity/infrastructure/http/identity.routes';
import eventsRoutes from '../modules/events/infrastructure/http/events.routes';
import paymentRoutes from '../modules/payment/infrastructure/http/payment.routes';
import notificationRoutes from '../modules/notification/infrastructure/http/notification.routes';

const router = Router();

router.use('/identity', identityRoutes);
router.use('/events', eventsRoutes);
router.use('/payment', paymentRoutes);
router.use('/notification', notificationRoutes);

export default router;
