import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  TEST_ACCOUNTS, 
  FAST_LOGIN_PROFILES, 
  findTestAccountByEmail 
} from './session';

describe('TRC Session & Fast Login Profiles', () => {
  it('should define all 3 required fast login profiles', () => {
    assert.equal(FAST_LOGIN_PROFILES.length, 3);
    
    const renterProfile = FAST_LOGIN_PROFILES.find(p => p.id === 'profile_renter');
    assert.ok(renterProfile);
    assert.equal(renterProfile.label, 'Ananya Sharma');
    assert.equal(renterProfile.user.name, 'Ananya Sharma');
    assert.equal(renterProfile.user.userType, 'renter');
    assert.equal(renterProfile.user.role, 'user');
    assert.equal(renterProfile.redirectUrl, '/homes');

    const ownerProfile = FAST_LOGIN_PROFILES.find(p => p.id === 'profile_owner');
    assert.ok(ownerProfile);
    assert.equal(ownerProfile.label, 'Suresh Reddy');
    assert.equal(ownerProfile.user.name, 'Suresh Reddy');
    assert.equal(ownerProfile.user.userType, 'owner');
    assert.equal(ownerProfile.user.role, 'user');
    assert.equal(ownerProfile.redirectUrl, '/owner/listings');

    const adminProfile = FAST_LOGIN_PROFILES.find(p => p.id === 'profile_admin');
    assert.ok(adminProfile);
    assert.equal(adminProfile.label, 'Founder / Moderator');
    assert.equal(adminProfile.user.name, 'Founder / Moderator');
    assert.equal(adminProfile.user.role, 'admin');
    assert.equal(adminProfile.redirectUrl, '/admin/listings');
  });

  it('should find pre-configured test accounts by email', () => {
    const ananya = findTestAccountByEmail('ananya.sharma@therentalcircle.in');
    assert.equal(ananya.name, 'Ananya Sharma');
    assert.equal(ananya.userType, 'renter');

    const suresh = findTestAccountByEmail('suresh.reddy@therentalcircle.in');
    assert.equal(suresh.name, 'Suresh Reddy');
    assert.equal(suresh.userType, 'owner');

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
