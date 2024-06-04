CREATE TABLE `bps` (
	`bpname` text PRIMARY KEY NOT NULL,
	`ranking` integer,
	`number` integer,
	`date` text
);
--> statement-breakpoint
CREATE TABLE `head` (
	`id` integer PRIMARY KEY NOT NULL,
	`head_block_num` integer,
	`head_block_time` text,
	`head_block_producer` text
);
