import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getAuth } from './auth';

describe('Better Auth Configuration & __Host- Cookie Attributes (RFC 6265bis)', () => {
  const auth = getAuth();

  it('should configure baseURL to app.therentalcircle.in by default', () => {
    assert.ok(auth.options.baseURL.includes('app.therentalcircle.in') || auth.options.baseURL.includes('localhost'));
  });

  it('should enforce __Host- cookie prefix in advanced configuration', () => {
    assert.equal(auth.options.advanced?.cookiePrefix, '__Host-');
  });

  it('should enforce useSecureCookies = true for HTTPS-only transmission', () => {
    assert.equal(auth.options.advanced?.useSecureCookies, true);
  });

  it('should strictly have Path=/ and NO Domain attribute for __Host- compliance', () => {
    const cookieAttrs = auth.options.advanced?.defaultCookieAttributes;
    assert.ok(cookieAttrs, 'defaultCookieAttributes should be defined');
    assert.equal(cookieAttrs.secure, true, 'Cookie MUST have Secure attribute');
    assert.equal(cookieAttrs.path, '/', 'Cookie MUST have Path=/ attribute');
    assert.equal(cookieAttrs.domain, undefined, 'Cookie MUST NOT have a Domain attribute per RFC 6265bis');
    assert.equal(cookieAttrs.sameSite, 'lax', 'Cookie should have SameSite=Lax');
  });

  it('should configure social provider Google with credentials', () => {
    assert.ok(auth.options.socialProviders?.google);
  });

  it('should disable emailAndPassword and enable emailOTP', () => {
    assert.equal(auth.options.emailAndPassword?.enabled, false);
    assert.equal(auth.options.emailOTP?.enabled, true);
  });

  it('should register all 8 custom user fields', () => {
    const fields = auth.options.user?.additionalFields;
    assert.ok(fields);
    assert.ok(fields.role);
    assert.ok(fields.phoneHash);
    assert.ok(fields.encryptedPhone);
    assert.ok(fields.phoneVerified);
    assert.ok(fields.phoneConfirmedAt);
    assert.ok(fields.phoneConfirmedBy);
    assert.ok(fields.phoneConfirmationMethod);
    assert.ok(fields.isBanned);
  });
});
