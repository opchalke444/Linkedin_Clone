import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'LinkedIn Clone Professional Network API',
    version: '1.0.0',
    description:
      'Production-style RESTful API for LinkedIn Clone professional networking platform. Built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.',
    contact: {
      name: 'LinkedIn Clone Developer Support',
      email: 'dev@linkedin-clone.local',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'linkedin_token',
        description: 'HTTP-only session cookie set automatically upon login or registration',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'password'],
                properties: {
                  fullName: { type: 'string', example: 'Alex Rivera' },
                  email: { type: 'string', example: 'alex.rivera@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  headline: { type: 'string', example: 'Software Engineer' },
                  location: { type: 'string', example: 'San Francisco, CA' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully and cookie set.' },
          400: { description: 'Validation error or email already in use.' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log into user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'alex.rivera@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful and HTTP-only cookie issued.' },
          400: { description: 'Invalid email or password.' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current authenticated user profile and stats',
        tags: ['Authentication'],
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Authenticated user profile details.' },
          401: { description: 'Unauthorized.' },
        },
      },
    },
    '/posts': {
      get: {
        summary: 'Get paginated feed with deterministic feed ranking',
        tags: ['Posts & Feed'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Ranked list of posts.' },
        },
      },
      post: {
        summary: 'Create a new post',
        tags: ['Posts & Feed'],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', example: 'Excited to share our new release!' },
                  imageUrl: { type: 'string' },
                  tags: { type: 'string', example: '#webdev #typescript' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Post created.' },
        },
      },
    },
    '/posts/{id}/reactions': {
      post: {
        summary: 'Toggle or change reaction on a post (LIKE, CELEBRATE, SUPPORT, LOVE, INSIGHTFUL)',
        tags: ['Posts & Feed'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type'],
                properties: {
                  type: {
                    type: 'string',
                    enum: ['LIKE', 'CELEBRATE', 'SUPPORT', 'LOVE', 'INSIGHTFUL'],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Updated post reaction state.' },
        },
      },
    },
    '/users/recommendations': {
      get: {
        summary: 'Feature 2: Skill-Based Network Discovery ("People you may know")',
        tags: ['Users & Discovery'],
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'List of suggested professionals with common skills and similarity score.' },
        },
      },
    },
    '/opportunities': {
      get: {
        summary: 'Feature 3: Professional Opportunity Matching (Rule-based score)',
        tags: ['Opportunities'],
        responses: {
          200: { description: 'List of opportunities scored against user skills.' },
        },
      },
    },
  },
};

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;
