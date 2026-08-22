import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  isAuthorizedAdmin, 
  findTestAccountByEmail 
} from './session';

describe('TRC Session & Role Authorization', () => {
  it('should accurately authorize admin accounts by email', () => {
    assert.equal(isAuthorizedAdmin('chmahesh997@gmail.com'), true);
    assert.equal(isAuthorizedAdmin('admin.trc@therentalcircle.in'), true);
    assert.equal(isAuthorizedAdmin('admin@therentalcircle.in'), true);
    assert.equal(isAuthorizedAdmin('regular.user@example.com'), false);
    assert.equal(isAuthorizedAdmin(undefined), false);
  });

  it('should dynamically generate session user for arbitrary emails', () => {
    const customUser = findTestAccountByEmail('custom.renter@example.com');
    assert.ok(customUser.id.startsWith('usr_'));
    assert.equal(customUser.email, 'custom.renter@example.com');
    assert.equal(customUser.role, 'user');
    assert.equal(customUser.userType, 'renter');

    const customOwner = findTestAccountByEmail('new.owner@example.com');
    assert.equal(customOwner.userType, 'owner');

    const customAdmin = findTestAccountByEmail('admin.supervisor@example.com');
    assert.equal(customAdmin.role, 'admin');
    assert.equal(customAdmin.userType, 'admin');
  });
});
