import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getDataStore } from './data-store';
import { PiiProtector } from './crypto';

describe('Renter Requests API & Data Store Integration', () => {
  it('should fetch all requests enriched with listing details', () => {
    const store = getDataStore();
    const testListing = store.createListing({
      slug: 'test-req-suite-listing',
      ownerId: 'usr_owner_test',
      ownerName: 'Suresh Reddy',
      ownerPhone: '+919849012345',
      ownerEmail: 'suresh@example.com',
      status: 'published',
      cluster: 'kondapur',
      colonyOrSociety: 'Silpa Park',
      landmark: 'Near Botanical Garden',
      pincode: '500084',
      title: '1 RK Botanical Suite Test',
      description: 'Test description',
      propertyType: '1rk',
      monthlyRent: 12000,
      securityDeposit: 24000,
      maintenanceCharges: 1000,
      isMaintenanceIncluded: false,
      lockInMonths: 6,
      noticeDays: 30,
      furnishingStatus: 'semi_furnished',
      carpetAreaSqFt: 380,
      floorNumber: 2,
      totalFloors: 4,
      availableFrom: '2026-09-01',
      petsAllowed: false,
      amenities: ['Water'],
      photos: [],
    });

    const testReq = store.createRequest({
      listingId: testListing.id,
      renterId: 'usr_renter_test_suite',
      renterName: 'Pooja Verma',
      renterPhone: '+919876543210',
      renterEmail: 'pooja@example.com',
      intendedMoveInDate: '2026-09-01',
      rentalDurationMonths: 11,
      occupantsCount: 1,
      householdArrangement: 'individual',
      employmentCategory: 'salaried',
    });

    store.acceptRequest(testReq.id);

    const requests = store.getRequests();
    assert.ok(requests.length >= 1);

    const acceptedReq = requests.find(r => r.id === testReq.id);
    assert.ok(acceptedReq);
    assert.equal(acceptedReq.status, 'accepted');

    const listing = store.getListingById(acceptedReq.listingId);
    assert.ok(listing);
    assert.equal(store.isContactUnlocked(acceptedReq.id), true);
  });

  it('should successfully create a new rental request with canonicalized phone', () => {
    const store = getDataStore();
    const listings = store.getListings();
    const listingId = listings[0].id;
    const rawPhone = '98765 43210';
    const canonicalPhone = PiiProtector.canonicalizePhone(rawPhone);
    assert.equal(canonicalPhone, '+919876543210');

    const newReq = store.createRequest({
      listingId,
      renterId: 'usr_renter_test_2',
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
    const renterRequests = store.getRenterRequests('usr_renter_test_2');
    assert.equal(renterRequests.length, 1);
    assert.equal(renterRequests[0].id, newReq.id);
  });

  it('should generate valid WhatsApp click-to-chat links for accepted owner contact', () => {
    const store = getDataStore();
    const listings = store.getListings();
    const listing = listings[0];
    assert.ok(listing);

    const digits = listing.ownerPhone.replace(/[^0-9]/g, '');
    const title = listing.title;
    const msg = `Hi, I saw your property on The Rental Circle (${title}). My move-in application was accepted. Would love to schedule a visit.`;
    const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;

    assert.ok(waUrl.startsWith('https://wa.me/919849012345?text='));
    assert.ok(waUrl.includes('The%20Rental%20Circle'));
  });
});
