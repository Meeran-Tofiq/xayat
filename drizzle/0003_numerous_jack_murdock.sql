ALTER TABLE `tasks_table` ADD `completed` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks_table` ADD `color` text;--> statement-breakpoint
ALTER TABLE `tasks_table` DROP COLUMN `orderDueDate`;