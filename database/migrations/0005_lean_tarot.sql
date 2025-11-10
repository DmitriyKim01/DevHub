ALTER TABLE `users` ADD `verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token_expire` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` integer DEFAULT false NOT NULL;