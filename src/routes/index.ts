import { Router } from 'express';
import userRoutes from '../modules/users/infrastructure/http/user.routes';
import authRoutes from '../modules/auth/infrastructure/http/auth.routes';
import catalogRoutes from '../modules/catalog/infrastructure/http/catalog.routes';
import ticketingRoutes from '../modules/ticketing/infrastructure/http/ticketing.routes';
import paymentRoutes from '../modules/payment/infrastructure/http/payment.routes';
import promoRoutes from '../modules/promo/infrastructure/http/promo.routes';
import notifRoutes from '../modules/notif/infrastructure/http/notif.routes';
import fraudRoutes from '../modules/fraud/infrastructure/http/fraud.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use('/ticketing', ticketingRoutes);
router.use('/payment', paymentRoutes);
router.use('/promo', promoRoutes);
router.use('/notif', notifRoutes);
router.use('/fraud', fraudRoutes);

export default router;
