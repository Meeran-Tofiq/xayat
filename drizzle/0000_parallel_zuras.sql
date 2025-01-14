CREATE TABLE `tailors_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`notes` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tailors_table_phone_unique` ON `tailors_table` (`phone`);