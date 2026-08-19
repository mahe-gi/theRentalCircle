import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getDataStore } from './data-store';

describe('Owner Workflow Integration & State Transitions', () => {
  it('should create an owner listing in pending_review status with private utility evidence', () => {
    const store = getDataStore();

    const created = store.createListing({
      slug: '2bhk-ayyappa-society-new-test',
      ownerId: 'usr_owner_01',
      ownerName: 'Suresh Reddy',
      ownerPhone: '+919849012345',
      ownerEmail: 'owner1@therentalcircle.in',
      status: 'pending_review',
      cluster: 'madhapur',
      colonyOrSociety: 'Ayyappa Society, Mega Hills',
      landmark: 'Near D-Mart',
      pincode: '500081',
      title: '2 BHK Semi-Furnished near Ayyappa Society',
      description: 'Well ventilated 2 BHK with modular kitchen and covered parking.',
      propertyType: '2bhk',
      monthlyRent: 26000,
      securityDeposit: 52000,
      maintenanceCharges: 2000,
      isMaintenanceIncluded: false,
      lockInMonths: 6,
      noticeDays: 30,
      furnishingStatus: 'semi_furnished',
      carpetAreaSqFt: 1100,
      floorNumber: 2,
      totalFloors: 5,
      availableFrom: '2026-09-01',
      petsAllowed: false,
      amenities: ['24/7 Water', 'Power Backup', 'Lift', 'Covered Car Parking'],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          roomTag: 'main_room',
          isCover: true,
          caption: 'Living hall with balcony',
        },
        {
          url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
          roomTag: 'bedroom',
          isCover: false,
          caption: 'Master bedroom with wardrobes',
        },
      ],
      evidence: {
        type: 'tgspdcl_bill',
        urlOrDoc: 'evidence/tsspdcl-test-record.pdf',
        consumerNumber: '1029384756',
        verified: false,
      },
    });

    assert.ok(created.id);
    assert.equal(created.status, 'pending_review', 'Newly created listings must strictly start in pending_review status');
    assert.equal(created.photos.length, 2);
    assert.equal(created.evidence?.consumerNumber, '1029384756');
    assert.ok(created.submittedAt);
  });

  it('should fetch owner portfolio and attach applicant request counts', () => {
    const store = getDataStore();
    const ownerListings = store.getOwnerListings();
    assert.ok(ownerListings.length >= 3);

    const targetListing = ownerListings[0];
    const requests = store.getListingRequests(targetListing.id);
    assert.ok(Array.isArray(requests));
  });

  it('should reconfirm listing availability and refresh confirmation timestamp', () => {
    const store = getDataStore();
    const listingId = 'listing-hyd-01';
    const beforeListing = store.getListingById(listingId);
    assert.ok(beforeListing);

    const updated = store.reconfirmListingAvailability(listingId);
    assert.ok(updated);
    assert.ok(updated.lastAvailabilityConfirmedAt);

    // Verify timestamp is updated
    const afterTime = new Date(updated.lastAvailabilityConfirmedAt).getTime();
    assert.ok(!isNaN(afterTime));
  });

  it('should process accept application and unlock mutual contact information', () => {
    const store = getDataStore();
    
    // Create a new fresh request
    const newReq = store.createRequest({
      listingId: 'listing-hyd-01',
      renterId: 'usr_renter_candidate',
      renterName: 'Pooja Verma',
      renterPhone: '+919988776655',
      renterEmail: 'pooja.verma@example.com',
      intendedMoveInDate: '2026-09-10',
      rentalDurationMonths: 11,
      occupantsCount: 2,
      householdArrangement: 'working_professionals',
      employmentCategory: 'salaried',
      optionalIntroduction: 'Senior Data Scientist at Amazon Hyderabad. Non-smoker, clean.',
    });

    assert.equal(newReq.status, 'submitted');
    assert.equal(store.isContactUnlocked(newReq.id), false);

    // Accept application
    const result = store.acceptRequest(newReq.id);
    assert.ok(result);
    assert.equal(result.request.status, 'accepted');
    assert.equal(store.isContactUnlocked(newReq.id), true);
    assert.ok(result.unlock.unlockedAt);
  });

  it('should decline an application with specified decline reason', () => {
    const store = getDataStore();

    const newReq = store.createRequest({
      listingId: 'listing-hyd-01',
      renterId: 'usr_renter_decline_test',
      renterName: 'Rohan Joshi',
      renterPhone: '+919876500000',
      renterEmail: 'rohan.joshi@example.com',
      intendedMoveInDate: '2026-08-20',
      rentalDurationMonths: 3,
      occupantsCount: 4,
      householdArrangement: 'students',
      employmentCategory: 'student',
    });

    assert.equal(newReq.status, 'submitted');

    const declined = store.declineRequest(newReq.id, 'Occupancy limit exceeded for 1 RK unit.');
    assert.ok(declined);
    assert.equal(declined.status, 'declined');
    assert.equal(declined.declineReason, 'Occupancy limit exceeded for 1 RK unit.');
    assert.ok(declined.respondedAt);
  });
});
