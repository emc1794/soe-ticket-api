import { Router } from 'express';
import { TicketingController } from './TicketingController';
import { PlaceOrder } from '../../application/PlaceOrder';
import { orderRepository, ticketRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';
import { eventBus } from '../../../../shared/infrastructure/bus/sharedEventBus';
import { StaticPromoCodeRepository } from '../../../promo/infrastructure/persistence/StaticPromoCodeRepository';
import { ValidatePromoCode } from '../../../promo/application/ValidatePromoCode';
import { CheckFraud } from '../../../fraud/application/CheckFraud';
import { authMiddleware } from '../../../../middlewares/auth.middleware';

const router = Router();

const promoRepository = new StaticPromoCodeRepository();
const validatePromoCode = new ValidatePromoCode(promoRepository);
const checkFraud = new CheckFraud();
const placeOrder = new PlaceOrder(orderRepository, ticketRepository, eventBus, validatePromoCode, checkFraud);
const ticketingController = new TicketingController(placeOrder);

/**
 * @swagger
 * /ticketing/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [ticketing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userId:
 *                 type: string
 *               eventId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authMiddleware, (req, res) => ticketingController.createOrder(req, res));

export default router;
