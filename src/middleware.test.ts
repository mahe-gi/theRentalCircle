import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveHostRouting } from './middleware';

describe('Hostname Routing Matrix', () => {
  it('should permanently redirect www.therentalcircle.in to apex (301)', () => {
    const res = resolveHostRouting('www.therentalcircle.in', '/homes');
    assert.equal(res.type, 'redirect');
    assert.equal(res.location, 'https://therentalcircle.in/homes');
    assert.equal(res.statusCode, 301);
  });

  it('should permanently redirect www.therentalcircle.in root to apex root (301)', () => {
    const res = resolveHostRouting('www.therentalcircle.in:443', '/');
    assert.equal(res.type, 'redirect');
    assert.equal(res.location, 'https://therentalcircle.in/');
    assert.equal(res.statusCode, 301);
  });

  it('should allow public marketing and SEO pages on apex therentalcircle.in', () => {
    assert.equal(resolveHostRouting('therentalcircle.in', '/').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/how-it-works').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/safety').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/privacy').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/grievance').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.in', '/list-your-property').type, 'allow');
  });

  it('should redirect app-only routes from apex to app.therentalcircle.in', () => {
    const signin = resolveHostRouting('therentalcircle.in', '/sign-in');
    assert.equal(signin.type, 'redirect');
    assert.equal(signin.location, 'https://app.therentalcircle.in/sign-in');

    const admin = resolveHostRouting('therentalcircle.in', '/admin/listings');
    assert.equal(admin.type, 'redirect');
    assert.equal(admin.location, 'https://app.therentalcircle.in/admin/listings');
  });

  it('should allow app and browsing routes on app.therentalcircle.in', () => {
    assert.equal(resolveHostRouting('app.therentalcircle.in', '/homes').type, 'allow');
    assert.equal(resolveHostRouting('app.therentalcircle.in', '/homes/1rk-kondapur').type, 'allow');
    assert.equal(resolveHostRouting('app.therentalcircle.in', '/sign-in').type, 'allow');
    assert.equal(resolveHostRouting('app.therentalcircle.in', '/owner/listings/new').type, 'allow');
  });

  it('should redirect non-asset page requests on media.therentalcircle.in to apex', () => {
    const res = resolveHostRouting('media.therentalcircle.in', '/homes');
    assert.equal(res.type, 'redirect');
    assert.equal(res.location, 'https://therentalcircle.in');
  });

  it('should allow development and preview hostnames (localhost, 127.0.0.1, workers.dev)', () => {
    assert.equal(resolveHostRouting('localhost:3000', '/homes').type, 'allow');
    assert.equal(resolveHostRouting('127.0.0.1:8787', '/sign-in').type, 'allow');
    assert.equal(resolveHostRouting('therentalcircle.pages.dev', '/').type, 'allow');
  });
});
