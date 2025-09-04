PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meters` integer NOT NULL,
	`design` text NOT NULL,
	`payed` integer NOT NULL,
	`orderReceived` text DEFAULT (CURRENT_DATE),
	`orderDueDate` text DEFAULT (CURRENT_DATE),
	`tailorId` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tasks_table`("id", "meters", "design", "payed", "orderReceived", "orderDueDate", "tailorId") SELECT "id", "meters", "design", "payed", "orderReceived", "orderDueDate", "tailorId" FROM `tasks_table`;--> statement-breakpoint
DROP TABLE `tasks_table`;--> statement-breakpoint
ALTER TABLE `__new_tasks_table` RENAME TO `tasks_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;