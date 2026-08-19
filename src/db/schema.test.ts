import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as schema from './schema';

describe('Drizzle D1 Schema Validation', () => {
  it('should export all 16 core tables', () => {
    const expectedTables = [
      'user',
      'session',
      'account',
      'verification',
      'listing',
      'listingMedia',
      'listingAmenity',
      'verificationCheck',
      'evidenceUpload',
      'rentalRequest',
      'contactUnlock',
      'availabilityConfirmation',
      'report',
      'moderationAction',
      'auditEvent',
      'deletionRequest',
    ];

    for (const tableName of expectedTables) {
      assert.ok((schema as any)[tableName], `Table ${tableName} must be exported`);
    }
  });

  it('should validate all 7 canonical listing states in listing status enum', () => {
    const listingTable = schema.listing;
    assert.ok(listingTable);
    const statusCol = (listingTable as any).status;
    assert.ok(statusCol);
    const expectedStates = [
      'draft',
      'pending_review',
      'published',
      'paused',
      'rented',
      'rejected',
      'suspended',
    ];
    assert.deepEqual(statusCol.enumValues, expectedStates);
  });
});
