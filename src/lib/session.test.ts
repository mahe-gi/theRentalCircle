import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  TEST_ACCOUNTS, 
  FAST_LOGIN_PROFILES, 
  findTestAccountByEmail 
} from './session';

describe('TRC Session & Fast Login Profiles', () => {
  it('should define required admin fast login profiles', () => {
    assert.ok(FAST_LOGIN_PROFILES.length >= 1);
    
    const maheshProfile = FAST_LOGIN_PROFILES.find(p => p.id === 'profile_admin_mahesh');
    assert.ok(maheshProfile);
    assert.equal(maheshProfile.label, 'Mahesh (Founder)');
    assert.equal(maheshProfile.user.name, 'Mahesh (Founder / Admin)');
    assert.equal(maheshProfile.user.role, 'admin');
    assert.equal(maheshProfile.redirectUrl, '/admin/listings');

    const adminProfile = FAST_LOGIN_PROFILES.find(p => p.id === 'profile_admin');
    assert.ok(adminProfile);
    assert.equal(adminProfile.label, 'Founder / Moderator');
    assert.equal(adminProfile.user.role, 'admin');
    assert.equal(adminProfile.redirectUrl, '/admin/listings');
  });

  it('should find pre-configured test accounts by email', () => {
    const mahesh = findTestAccountByEmail('chmahesh997@gmail.com');
    assert.equal(mahesh.name, 'Mahesh (Founder / Admin)');
    assert.equal(mahesh.role, 'admin');

    const admin = findTestAccountByEmail('admin.trc@therentalcircle.in');
    assert.equal(admin.name, 'Founder / Moderator');
    assert.equal(admin.role, 'admin');
  });

  it('should dynamically generate verified session user for arbitrary emails', () => {
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
