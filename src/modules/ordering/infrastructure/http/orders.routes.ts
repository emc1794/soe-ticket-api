import { Router } from 'express';
import { OrderingController } from './OrderingController';
import { PlaceOrder } from '../../application/PlaceOrder';
import { orderRepository, ticketRepository } from '../../../../shared/infrastructure/persistence/RepositoryContainer';
import { eventBus } from '../../../../shared/infrastructure/bus/sharedEventBus';
import { authMiddleware } from '../../../../middlewares/auth.middleware';

const router = Router();

const placeOrder = new PlaceOrder(orderRepository, ticketRepository, eventBus);
const orderingController = new OrderingController(placeOrder);

/**
 * @swagger
 * /ordering/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [ordering]
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
router.post('/', authMiddleware, (req, res) => orderingController.createOrder(req, res));

export default router;
