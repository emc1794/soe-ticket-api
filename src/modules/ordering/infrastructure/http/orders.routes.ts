import { Router } from 'express';
import { OrderingController } from './OrderingController';
import { bookingSagaOrchestrator } from '../../saga/sharedBookingSagaOrchestrator';
import { authMiddleware } from '../../../../middlewares/auth.middleware';

const router = Router();

const orderingController = new OrderingController(bookingSagaOrchestrator);

/**
 * @swagger
 * /ordering/orders:
 *   post:
 *     summary: Start the Booking Saga (reserve seat -> fraud check -> async payment -> issuance)
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
 *               eventId:
 *                 type: string
 *               amount:
 *                 type: number
 *               seatNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       202:
 *         description: Accepted - saga started, payment processing asynchronously
 */
router.post('/', authMiddleware, (req, res) => orderingController.createOrder(req, res));

export default router;
