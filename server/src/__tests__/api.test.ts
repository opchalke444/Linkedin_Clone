import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../db/prisma.js';
import { ensurePostgresRunning } from '../db/embedded-pg.js';

describe('LinkedIn API Integration Tests', () => {
  let authToken = '';
  let authCookie = '';
  let testUserId = '';
  let peerUserId = '';
  let createdPostId = '';
  let createdCommentId = '';
  let testConnectionId = '';

  const testEmail = `test.dev.${Date.now()}@example.com`;
  const peerEmail = `peer.dev.${Date.now()}@example.com`;

  beforeAll(async () => {
    await ensurePostgresRunning();
    // Clean up test users if any
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, peerEmail] } },
    });
  });

  // 1. AUTHENTICATION TESTS
  describe('Authentication Endpoints (/api/auth)', () => {
    it('should register a new user successfully with valid details', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Taylor Morgan',
          email: testEmail,
          password: 'Password123!',
          headline: 'Full-Stack Developer',
          location: 'San Francisco, CA',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.token).toBeDefined();

      // Check cookie
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();

      testUserId = res.body.data.user.id;
      authToken = res.body.data.token;
      authCookie = cookies[0];
    });

    it('should prevent registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Taylor Clone',
          email: testEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject registration with weak password (missing uppercase or number)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Weak Pass',
          email: `weak.${Date.now()}@example.com`,
          password: 'weakpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword999!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should get current authenticated user (/api/auth/me) with token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testUserId);
      expect(res.body.data.completeness).toBeDefined();
    });

    it('should block unauthenticated requests to protected routes', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // 2. CREATE A PEER USER FOR RELATIONSHIP TESTS
  describe('Setup Peer User', () => {
    it('should register a peer user for connection and messaging tests', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Sam Jordan',
          email: peerEmail,
          password: 'Password123!',
          headline: 'DevOps & Cloud Engineer',
          location: 'Austin, TX',
        });

      expect(res.status).toBe(201);
      peerUserId = res.body.data.user.id;
    });
  });

  // 3. POSTS & REACTIONS TESTS
  describe('Posts Endpoints (/api/posts)', () => {
    it('should create a new post with valid authentication', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Building full-stack systems with PostgreSQL and Prisma! #engineering #webdev',
          tags: '#engineering #webdev',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toContain('Building full-stack systems');
      createdPostId = res.body.data.id;
    });

    it('should fetch feed containing newly created post', async () => {
      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((p: any) => p.id === createdPostId)).toBe(true);
    });

    it('should toggle a reaction (LIKE) on a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${createdPostId}/reactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'LIKE' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userReaction).toBe('LIKE');
      expect(res.body.data.likeCount).toBeGreaterThanOrEqual(1);
    });

    it('should add a comment to a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Great insights on database relations!' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe('Great insights on database relations!');
      createdCommentId = res.body.data.id;
    });

    it('should add a nested reply to the comment', async () => {
      const res = await request(app)
        .post(`/api/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Thanks for reading! Agreed.',
          parentId: createdCommentId,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parentId).toBe(createdCommentId);
    });
  });

  // 4. CONNECTIONS TESTS
  describe('Connections Endpoints (/api/connections)', () => {
    it('should prevent sending a connection request to oneself', async () => {
      const res = await request(app)
        .post(`/api/connections/request/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('cannot connect with yourself');
    });

    it('should send a connection request to peer user', async () => {
      const res = await request(app)
        .post(`/api/connections/request/${peerUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      testConnectionId = res.body.data.id;
    });

    it('should prevent sending duplicate connection requests', async () => {
      const res = await request(app)
        .post(`/api/connections/request/${peerUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already');
    });
  });

  // 5. MESSAGING TESTS
  describe('Messaging Endpoints (/api/messages)', () => {
    it('should send a direct message and create persistent conversation', async () => {
      const res = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          receiverId: peerUserId,
          content: 'Hello Sam, excited to connect on LinkedIn!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe('Hello Sam, excited to connect on LinkedIn!');
    });

    it('should retrieve conversation list for current user', async () => {
      const res = await request(app)
        .get('/api/messages/conversations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // 6. THREE ORIGINAL FEATURES TESTS
  describe('Three Original Features Verification', () => {
    // Feature 1: Profile Completeness
    it('Feature 1: Profile Completeness calculates correct percentage and level', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      const completeness = res.body.data.completeness;
      expect(completeness).toBeDefined();
      expect(completeness.percentage).toBeGreaterThan(0);
      expect(['Beginner', 'Intermediate', 'All-Star']).toContain(completeness.level);
      expect(completeness.nextStep).toBeDefined();
    });

    // Feature 2: Skill-Based Discovery
    it('Feature 2: Skill-Based Network Discovery recommends peers based on shared skills', async () => {
      // Add skills to test user
      await request(app)
        .post('/api/profile/skills')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'React', proficiency: 'ADVANCED' });

      await request(app)
        .post('/api/profile/skills')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'TypeScript', proficiency: 'ADVANCED' });

      const res = await request(app)
        .get('/api/users/recommendations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      // Verify each recommendation has similarityScore and commonSkills
      if (res.body.data.length > 0) {
        const first = res.body.data[0];
        expect(first.similarityScore).toBeDefined();
        expect(Array.isArray(first.commonSkills)).toBe(true);
      }
    });

    // Feature 3: Professional Opportunity Matching
    it('Feature 3: Professional Opportunity Matching scores listings against candidate skills', async () => {
      const res = await request(app)
        .get('/api/opportunities')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const first = res.body.data[0];
      expect(first.matchScore).toBeDefined();
      expect(Array.isArray(first.matchingSkills)).toBe(true);
      expect(Array.isArray(first.missingSkills)).toBe(true);
    });
  });
});
