const request = require('supertest');
const app = require('../src/app');
const message = require('../src/message');

// These tests run automatically in GitHub Actions on every push.
// If ANY test fails, the pipeline stops and nothing gets deployed.

describe('TechyCamp demo app', () => {
  it('is alive: /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('shows the headline on the home page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('TechyCamp');
  });

  it('headline is not empty', () => {
    expect(message.headline.trim().length).toBeGreaterThan(0);
  });

  it('headline fits on a phone screen (max 60 characters)', () => {
    expect(message.headline.length).toBeLessThanOrEqual(60);
  });
});
