import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getDataStore } from './data-store';
import { PiiProtector } from './crypto';

describe('Renter Requests API & Data Store Integration', () => {
  it('should fetch all requests enriched with listing details', () => {
    const store = getDataStore();
    const requests = store.getRequests();
    assert.ok(requests.length >= 4, 'Should have initial demo requests');

    const acceptedReq = requests.find(r => r.status === 'accepted');
    assert.ok(acceptedReq, 'Should have at least one accepted request');

    const listing = store.getListingById(acceptedReq.listingId);
    assert.ok(listing, 'Accepted request should map to a valid listing');
    assert.equal(store.isContactUnlocked(acceptedReq.id), true, 'Accepted request should have contact unlocked');
  });

  it('should successfully create a new rental request with canonicalized phone', () => {
    const store = getDataStore();
    const rawPhone = '98765 43210';
    const canonicalPhone = PiiProtector.canonicalizePhone(rawPhone);
    assert.equal(canonicalPhone, '+919876543210');

    const newReq = store.createRequest({
      listingId: 'listing-hyd-01',
      renterId: 'usr_renter_test',
      renterName: 'Test Renter',
      renterPhone: canonicalPhone,
      renterEmail: 'test.renter@example.com',
      intendedMoveInDate: '2026-10-01',
      rentalDurationMonths: 11,
      occupantsCount: 1,
      householdArrangement: 'individual',
      employmentCategory: 'salaried',
      optionalIntroduction: 'Hello, looking forward to renting.',
    });

    assert.ok(newReq.id);
    assert.equal(newReq.status, 'submitted');
    assert.equal(newReq.renterPhone, '+919876543210');

    // Retrieve via getRenterRequests
    const renterRequests = store.getRenterRequests('usr_renter_test');
    assert.equal(renterRequests.length, 1);
    assert.equal(renterRequests[0].id, newReq.id);
  });

  it('should generate valid WhatsApp click-to-chat links for accepted owner contact', () => {
    const store = getDataStore();
    const acceptedReq = store.getRequestById('req-001');
    assert.ok(acceptedReq);

    const listing = store.getListingById(acceptedReq.listingId);
    assert.ok(listing);

    const digits = listing.ownerPhone.replace(/[^0-9]/g, '');
    const title = listing.title;
    const msg = `Hi, I saw your property on The Rental Circle (${title}). My move-in application was accepted. Would love to schedule a visit.`;
    const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;

    assert.ok(waUrl.startsWith('https://wa.me/919849012345?text='));
    assert.ok(waUrl.includes('The%20Rental%20Circle'));
  });
});
