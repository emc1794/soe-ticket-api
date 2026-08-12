import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TicketWave Events API',
      version: '1.0.0',
      description: 'API for TicketWave Events platform',
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'identity', description: 'Authentication, authorization, and user profile (Identity Module).' },
      { name: 'events', description: 'Event catalog, search, and lifecycle (Events Module).' },
      { name: 'venues', description: "Venue Plugin Manager — pluggable venue integrations for seating maps and real-time availability." },
      { name: 'search', description: 'General-purpose search endpoint.' },
      { name: 'payment', description: 'Payment Module status.' },
      { name: 'notification', description: 'Notification Module status.' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            data: { type: 'object' },
            metadata: { type: 'object' },
          },
        },
        SimpleError: {
          type: 'object',
          description: 'Error shape returned by endpoints that catch and respond directly, without going through the global error middleware.',
          properties: {
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        ErrorResponse: {
          type: 'object',
          description: 'Error shape returned by the global error middleware.',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'fail' },
                message: { type: 'string', example: 'Something went wrong' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
          },
        },
        AuthTokenResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT bearer token.' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            venueId: { type: 'string' },
            artist: { type: 'string' },
            city: { type: 'string' },
            type: { type: 'string', enum: ['assigned', 'general'] },
            metadata: { type: 'object' },
            status: { type: 'string', enum: ['ACTIVE', 'CANCELLED'] },
          },
        },
        Venue: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            capacity: { type: 'integer' },
          },
        },
        VenueProviders: {
          type: 'object',
          properties: {
            providers: {
              type: 'array',
              items: { type: 'string' },
              example: ['generic', 'legacy'],
            },
          },
        },
        SeatingSection: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            capacity: { type: 'integer' },
          },
        },
        SeatingMap: {
          type: 'object',
          properties: {
            venueId: { type: 'string' },
            provider: { type: 'string', example: 'generic' },
            sections: {
              type: 'array',
              items: { $ref: '#/components/schemas/SeatingSection' },
            },
          },
        },
        VenueAvailability: {
          type: 'object',
          properties: {
            venueId: { type: 'string' },
            provider: { type: 'string', example: 'generic' },
            availableSeats: {
              type: 'array',
              items: { type: 'string' },
            },
            checkedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
