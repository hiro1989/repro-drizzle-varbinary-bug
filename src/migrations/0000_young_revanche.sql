CREATE TABLE `test_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`varbinary_data` varbinary(10),
	`binary_data` binary(3),
	CONSTRAINT `test_table_id` PRIMARY KEY(`id`)
);
