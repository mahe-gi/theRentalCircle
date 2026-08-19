import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveHostRouting } from './middleware';

describe('Hostname Routing Matrix', () => {
  it('should allow all routes directly on apex therentalcircle.in', () => {
    assert.equal(resolveHostRouting('therentalcircle.in', '/').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/sign-in').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/homes').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/owner/listings').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/admin/listings').type, 'allow');
  });

  it('should allow all routes directly on www.therentalcircle.in', () => {
    assert.equal(resolveHostRouting('www.therentalcircle.in', '/').type, 'allow');
    assert.equal(resolveHostRouting('www.therentalcircle.in', '/sign-in').type, 'allow');
    assert.equal(resolveHostRouting('www.therentalcircle.in', '/homes').type, 'allow');
  });

  it('should allow app and browsing routes on app.therentalcircle.in', () => {
    assert.equal(resolveHostRouting('app.therentalcircle.in', '/homes').type, 'allow');
    assert.equal(resolveHostRouting('app.therentalcircle.in', '/sign-in').type, 'allow');
  });

  it('should redirect non-asset page requests on media.therentalcircle.in to apex', () => {
    const res = resolveHostRouting('media.therentalcircle.in', '/homes');
    assert.equal(res.type, 'redirect');
    assert.equal(res.location, 'https://therentalcircle.in');
  });

  it('should allow development and preview hostnames (localhost, 127.0.0.1, workers.dev, vercel.app)', () => {
    assert.equal(resolveHostRouting('localhost:3000', '/homes').type, 'allow');
    assert.equal(resolveHostRouting('127.0.0.1:8787', '/sign-in').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.vercel.app', '/sign-in').type, 'allow');
  });
});
