CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_account_provider_account` ON `account` (`provider_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `idx_account_user` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `audit_event` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_user_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`ip_hash` text,
	`metadata_json` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_entity` ON `audit_event` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_created` ON `audit_event` (`created_at`);--> statement-breakpoint
CREATE TABLE `availability_confirmation` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`sent_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`confirmed_at` integer,
	`status_response` text,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `availability_confirmation_token_hash_unique` ON `availability_confirmation` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_avail_listing` ON `availability_confirmation` (`listing_id`);--> statement-breakpoint
CREATE TABLE `contact_unlock` (
	`id` text PRIMARY KEY NOT NULL,
	`rental_request_id` text NOT NULL,
	`unlocked_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`rental_request_id`) REFERENCES `rental_request`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_unlock_rental_request_id_unique` ON `contact_unlock` (`rental_request_id`);--> statement-breakpoint
CREATE TABLE `deletion_request` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reason` text,
	`processed_by_user_id` text,
	`processed_at` integer,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`processed_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_deletion_user` ON `deletion_request` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_deletion_status` ON `deletion_request` (`status`);--> statement-breakpoint
CREATE TABLE `evidence_upload` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`verification_check_id` text,
	`private_r2_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`status` text DEFAULT 'quarantined' NOT NULL,
	`uploaded_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`reviewed_at` integer,
	`purge_at` integer,
	`purged_at` integer,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`verification_check_id`) REFERENCES `verification_check`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_evidence_purge` ON `evidence_upload` (`status`,`purge_at`);--> statement-breakpoint
CREATE TABLE `listing` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`cluster` text,
	`colony_or_society` text,
	`landmark` text,
	`pincode` text,
	`encrypted_exact_address` text,
	`title` text,
	`description` text,
	`property_type` text,
	`monthly_rent` integer,
	`security_deposit` integer,
	`maintenance_charges` integer,
	`is_maintenance_included` integer,
	`lock_in_months` integer,
	`notice_days` integer,
	`furnishing_status` text,
	`carpet_area_sq_ft` integer,
	`floor_number` integer,
	`total_floors` integer,
	`available_from` integer,
	`pets_allowed` integer,
	`moderation_notes` text,
	`rejection_reason` text,
	`submitted_at` integer,
	`published_at` integer,
	`last_availability_confirmed_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `listing_slug_unique` ON `listing` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_listing_status_published` ON `listing` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_listing_owner` ON `listing` (`owner_id`);--> statement-breakpoint
CREATE INDEX `idx_listing_cluster` ON `listing` (`cluster`);--> statement-breakpoint
CREATE INDEX `idx_listing_rent` ON `listing` (`monthly_rent`);--> statement-breakpoint
CREATE INDEX `idx_listing_type` ON `listing` (`property_type`);--> statement-breakpoint
CREATE TABLE `listing_amenity` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`amenity_key` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_listing_amenity_unique` ON `listing_amenity` (`listing_id`,`amenity_key`);--> statement-breakpoint
CREATE TABLE `listing_media` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`approved_r2_key` text NOT NULL,
	`room_tag` text DEFAULT 'other' NOT NULL,
	`caption` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_cover` integer DEFAULT false NOT NULL,
	`is_approved` integer DEFAULT false NOT NULL,
	`width` integer,
	`height` integer,
	`size_bytes` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_media_listing_order` ON `listing_media` (`listing_id`,`display_order`);--> statement-breakpoint
CREATE TABLE `moderation_action` (
	`id` text PRIMARY KEY NOT NULL,
	`moderator_user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`action_taken` text NOT NULL,
	`reason` text NOT NULL,
	`metadata_json` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`moderator_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `rental_request` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`renter_id` text NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`intended_move_in_date` integer NOT NULL,
	`rental_duration_months` integer DEFAULT 11 NOT NULL,
	`occupants_count` integer DEFAULT 1 NOT NULL,
	`household_arrangement` text NOT NULL,
	`employment_category` text NOT NULL,
	`pets_description` text,
	`optional_introduction` text,
	`viewed_at` integer,
	`responded_at` integer,
	`decline_reason` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`renter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_request_listing` ON `rental_request` (`listing_id`);--> statement-breakpoint
CREATE INDEX `idx_request_renter` ON `rental_request` (`renter_id`);--> statement-breakpoint
CREATE TABLE `report` (
	`id` text PRIMARY KEY NOT NULL,
	`reporter_user_id` text,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`resolved_by_user_id` text,
	`resolution_notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`reporter_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`resolved_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `idx_session_token` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `idx_session_user` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`phone_hash` text,
	`encrypted_phone` text,
	`phone_verified` integer DEFAULT false NOT NULL,
	`phone_confirmed_at` integer,
	`phone_confirmed_by` text,
	`phone_confirmation_method` text,
	`is_banned` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phone_hash_unique` ON `user` (`phone_hash`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `idx_user_phone_hash` ON `user` (`phone_hash`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_verification_identifier` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `verification_check` (
	`id` text PRIMARY KEY NOT NULL,
	`listing_id` text NOT NULL,
	`check_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`evidence_type` text,
	`reviewed_by_user_id` text,
	`reviewer_notes` text,
	`verified_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_check_listing` ON `verification_check` (`listing_id`,`status`);