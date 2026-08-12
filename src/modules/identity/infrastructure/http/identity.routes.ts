import { Router } from 'express';
import { AuthController } from './AuthController';
import { userController } from './UserController';
import { authMiddleware } from '../../../../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /identity/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account. Passwords are hashed before being persisted.
 *     tags: [identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email: { type: string, format: email, example: user@example.com }
 *               name: { type: string, example: Jane Doe }
 *               password: { type: string, format: password, example: password123 }
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Validation error, or the email is already registered
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SimpleError' }
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /identity/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user by email and password and returns a JWT bearer token.
 *     tags: [identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: user@example.com }
 *               password: { type: string, format: password, example: password123 }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/AuthTokenResponse' }
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SimpleError' }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /identity/profile:
 *   get:
 *     summary: Retrieve the authenticated user's profile
 *     tags: [identity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Missing, invalid, or expired token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SimpleError' }
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SimpleError' }
 */
router.get('/profile', authMiddleware, userController.getProfile);

export default router;
