CREATE TABLE `tasks_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meters` integer NOT NULL,
	`design` text NOT NULL,
	`payed` integer NOT NULL,
	`orderReceived` text DEFAULT (CURRENT_DATE),
	`orderDueDate` text DEFAULT (CURRENT_DATE),
	`tailorId` integer
);
