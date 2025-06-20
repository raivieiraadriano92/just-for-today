CREATE TABLE `gratitude_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`datetime` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `intentions` (
	`date` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`intention` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mood_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`datetime` text NOT NULL,
	`mood` text NOT NULL,
	`feelings` text NOT NULL,
	`note` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reflections` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`datetime` text NOT NULL,
	`content` text NOT NULL
);
