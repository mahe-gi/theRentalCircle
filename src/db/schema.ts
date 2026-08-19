import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

// 1. BETTER AUTH CORE TABLES
export const user = sqliteTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
  phoneHash: text('phone_hash').unique(),
  encryptedPhone: text('encrypted_phone'),
  phoneVerified: integer('phone_verified', { mode: 'boolean' }).default(false).notNull(),
  phoneConfirmedAt: integer('phone_confirmed_at', { mode: 'timestamp' }),
  phoneConfirmedBy: text('phone_confirmed_by'),
  phoneConfirmationMethod: text('phone_confirmation_method', { enum: ['founder_call', 'whatsapp_check', 'email_handshake'] }),
  isBanned: integer('is_banned', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_user_email').on(table.email),
  index('idx_user_phone_hash').on(table.phoneHash)
]);

export const session = sqliteTable('session', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_session_token').on(table.token),
  index('idx_session_user').on(table.userId)
]);

export const account = sqliteTable('account', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  uniqueIndex('idx_account_provider_account').on(table.providerId, table.accountId),
  index('idx_account_user').on(table.userId)
]);

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_verification_identifier').on(table.identifier)
]);

// 2. LISTINGS (7 Canonical States: draft, pending_review, published, paused, rented, rejected, suspended)
export const listing = sqliteTable('listing', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  slug: text('slug').notNull().unique(),
  status: text('status', { enum: ['draft', 'pending_review', 'published', 'paused', 'rented', 'rejected', 'suspended'] }).default('draft').notNull(),
  cluster: text('cluster', { enum: ['gachibowli', 'kondapur', 'madhapur', 'hitec_city', 'manikonda', 'financial_district'] }),
  colonyOrSociety: text('colony_or_society'),
  landmark: text('landmark'),
  pincode: text('pincode'),
  encryptedExactAddress: text('encrypted_exact_address'),
  title: text('title'),
  description: text('description'),
  propertyType: text('property_type', { enum: ['shared_room', 'private_room', '1rk', '1bhk', '2bhk', '3plus_bhk', 'independent_house', 'penthouse'] }),
  monthlyRent: integer('monthly_rent'),
  securityDeposit: integer('security_deposit'),
  maintenanceCharges: integer('maintenance_charges'),
  isMaintenanceIncluded: integer('is_maintenance_included', { mode: 'boolean' }),
  lockInMonths: integer('lock_in_months'),
  noticeDays: integer('notice_days'),
  furnishingStatus: text('furnishing_status', { enum: ['unfurnished', 'semi_furnished', 'fully_furnished'] }),
  carpetAreaSqFt: integer('carpet_area_sq_ft'),
  floorNumber: integer('floor_number'),
  totalFloors: integer('total_floors'),
  availableFrom: integer('available_from', { mode: 'timestamp' }),
  petsAllowed: integer('pets_allowed', { mode: 'boolean' }),
  moderationNotes: text('moderation_notes'),
  rejectionReason: text('rejection_reason'),
  submittedAt: integer('submitted_at', { mode: 'timestamp' }),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  lastAvailabilityConfirmedAt: integer('last_availability_confirmed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_listing_status_published').on(table.status, table.publishedAt),
  index('idx_listing_owner').on(table.ownerId),
  index('idx_listing_cluster').on(table.cluster),
  index('idx_listing_rent').on(table.monthlyRent),
  index('idx_listing_type').on(table.propertyType)
]);

// 3. LISTING MEDIA (Public trc-public-media Bucket Derivatives) & AMENITIES
export const listingMedia = sqliteTable('listing_media', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull().references(() => listing.id, { onDelete: 'cascade' }),
  approvedR2Key: text('approved_r2_key').notNull(),
  roomTag: text('room_tag', { enum: ['main_room', 'bedroom', 'kitchen', 'bathroom', 'balcony_exterior', 'other'] }).default('other').notNull(),
  caption: text('caption'),
  displayOrder: integer('display_order').default(0).notNull(),
  isCover: integer('is_cover', { mode: 'boolean' }).default(false).notNull(),
  isApproved: integer('is_approved', { mode: 'boolean' }).default(false).notNull(),
  width: integer('width'),
  height: integer('height'),
  sizeBytes: integer('size_bytes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_media_listing_order').on(table.listingId, table.displayOrder)
]);

export const listingAmenity = sqliteTable('listing_amenity', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull().references(() => listing.id, { onDelete: 'cascade' }),
  amenityKey: text('amenity_key').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  uniqueIndex('idx_listing_amenity_unique').on(table.listingId, table.amenityKey)
]);

// 4. VERIFICATION CHECKS & EVIDENCE UPLOADS (trc-private Bucket)
export const verificationCheck = sqliteTable('verification_check', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull().references(() => listing.id, { onDelete: 'cascade' }),
  checkType: text('check_type', { enum: ['listing_contact_call', 'listing_reviewed', 'property_connection_evidence', 'representative_authorization_evidence'] }).notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending').notNull(),
  evidenceType: text('evidence_type', { enum: ['phone_call', 'tgspdcl_bill', 'ghmc_tax_receipt', 'society_noc', 'authorization_letter', 'other'] }),
  reviewedByUserId: text('reviewed_by_user_id').references(() => user.id, { onDelete: 'set null' }),
  reviewerNotes: text('reviewer_notes'),
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_check_listing').on(table.listingId, table.status)
]);

export const evidenceUpload = sqliteTable('evidence_upload', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull().references(() => listing.id, { onDelete: 'cascade' }),
  verificationCheckId: text('verification_check_id').references(() => verificationCheck.id, { onDelete: 'cascade' }),
  privateR2Key: text('private_r2_key').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  status: text('status', { enum: ['quarantined', 'reviewed', 'rejected', 'purged'] }).default('quarantined').notNull(),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
  purgeAt: integer('purge_at', { mode: 'timestamp' }),
  purgedAt: integer('purged_at', { mode: 'timestamp' })
}, (table) => [
  index('idx_evidence_purge').on(table.status, table.purgeAt)
]);

// 5. RENTAL REQUESTS & IDEMPOTENT CONTACT UNLOCKS
export const rentalRequest = sqliteTable('rental_request', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull().references(() => listing.id, { onDelete: 'cascade' }),
  renterId: text('renter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['submitted', 'viewed', 'accepted', 'declined', 'withdrawn', 'expired', 'cancelled'] }).default('submitted').notNull(),
  intendedMoveInDate: integer('intended_move_in_date', { mode: 'timestamp' }).notNull(),
  rentalDurationMonths: integer('rental_duration_months').default(11).notNull(),
  occupantsCount: integer('occupants_count').default(1).notNull(),
  householdArrangement: text('household_arrangement', { enum: ['individual', 'family', 'working_professionals', 'students'] }).notNull(),
  employmentCategory: text('employment_category', { enum: ['salaried', 'self_employed', 'student', 'other'] }).notNull(),
  petsDescription: text('pets_description'),
  optionalIntroduction: text('optional_introduction'),
  viewedAt: integer('viewed_at', { mode: 'timestamp' }),
  respondedAt: integer('responded_at', { mode: 'timestamp' }),
  declineReason: text('decline_reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_request_listing').on(table.listingId),
  index('idx_request_renter').on(table.renterId)
]);

export const contactUnlock = sqliteTable('contact_unlock', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  rentalRequestId: text('rental_request_id').notNull().unique().references(() => rentalRequest.id, { onDelete: 'cascade' }),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
});

// 6. AVAILABILITY, REPORTS, 180-DAY AUDIT TRAIL & DELETION REQUESTS
export const availabilityConfirmation = sqliteTable('availability_confirmation', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  listingId: text('listing_id').notNull().references(() => listing.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  sentAt: integer('sent_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  confirmedAt: integer('confirmed_at', { mode: 'timestamp' }),
  statusResponse: text('status_response', { enum: ['still_available', 'rented_out', 'paused'] }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
}, (table) => [
  index('idx_avail_listing').on(table.listingId)
]);

export const report = sqliteTable('report', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  reporterUserId: text('reporter_user_id').references(() => user.id, { onDelete: 'set null' }),
  targetType: text('target_type', { enum: ['listing', 'user', 'rental_request'] }).notNull(),
  targetId: text('target_id').notNull(),
  reason: text('reason', { enum: ['broker_suspected', 'fake_property', 'incorrect_rent', 'incorrect_photos', 'property_unavailable', 'duplicate_listing', 'unsafe_interaction', 'spam_renter', 'harassment', 'unexpected_brokerage_demand'] }).notNull(),
  description: text('description'),
  status: text('status', { enum: ['pending', 'investigating', 'resolved', 'dismissed'] }).default('pending').notNull(),
  resolvedByUserId: text('resolved_by_user_id').references(() => user.id, { onDelete: 'set null' }),
  resolutionNotes: text('resolution_notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
});

export const moderationAction = sqliteTable('moderation_action', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  moderatorUserId: text('moderator_user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  targetType: text('target_type', { enum: ['listing', 'user', 'report'] }).notNull(),
  targetId: text('target_id').notNull(),
  actionTaken: text('action_taken', { enum: ['approve_listing', 'request_changes', 'reject_listing', 'pause_listing', 'suspend_listing', 'reinstate_listing', 'suspend_user', 'reinstate_user', 'dismiss_report'] }).notNull(),
  reason: text('reason').notNull(),
  metadataJson: text('metadata_json'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
});

export const auditEvent = sqliteTable('audit_event', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  actorUserId: text('actor_user_id'),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  ipHash: text('ip_hash'),
  metadataJson: text('metadata_json'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_audit_entity').on(table.entityType, table.entityId),
  index('idx_audit_created').on(table.createdAt)
]);

export const deletionRequest = sqliteTable('deletion_request', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'rejected'] }).default('pending').notNull(),
  reason: text('reason'),
  processedByUserId: text('processed_by_user_id').references(() => user.id, { onDelete: 'set null' }),
  processedAt: integer('processed_at', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull()
}, (table) => [
  index('idx_deletion_user').on(table.userId),
  index('idx_deletion_status').on(table.status)
]);

// Type exports for type safety across application
export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;

export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;

export type Listing = InferSelectModel<typeof listing>;
export type NewListing = InferInsertModel<typeof listing>;

export type ListingMedia = InferSelectModel<typeof listingMedia>;
export type NewListingMedia = InferInsertModel<typeof listingMedia>;

export type ListingAmenity = InferSelectModel<typeof listingAmenity>;
export type NewListingAmenity = InferInsertModel<typeof listingAmenity>;

export type VerificationCheck = InferSelectModel<typeof verificationCheck>;
export type NewVerificationCheck = InferInsertModel<typeof verificationCheck>;

export type EvidenceUpload = InferSelectModel<typeof evidenceUpload>;
export type NewEvidenceUpload = InferInsertModel<typeof evidenceUpload>;

export type RentalRequest = InferSelectModel<typeof rentalRequest>;
export type NewRentalRequest = InferInsertModel<typeof rentalRequest>;

export type ContactUnlock = InferSelectModel<typeof contactUnlock>;
export type NewContactUnlock = InferInsertModel<typeof contactUnlock>;

export type AvailabilityConfirmation = InferSelectModel<typeof availabilityConfirmation>;
export type NewAvailabilityConfirmation = InferInsertModel<typeof availabilityConfirmation>;

export type Report = InferSelectModel<typeof report>;
export type NewReport = InferInsertModel<typeof report>;

export type ModerationAction = InferSelectModel<typeof moderationAction>;
export type NewModerationAction = InferInsertModel<typeof moderationAction>;

export type AuditEvent = InferSelectModel<typeof auditEvent>;
export type NewAuditEvent = InferInsertModel<typeof auditEvent>;

export type DeletionRequest = InferSelectModel<typeof deletionRequest>;
export type NewDeletionRequest = InferInsertModel<typeof deletionRequest>;