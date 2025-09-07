DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `password_hash`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `updated_at`;