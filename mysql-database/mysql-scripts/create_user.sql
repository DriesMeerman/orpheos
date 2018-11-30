CREATE TABLE `orpheos`.`user` ( `id` INT NOT NULL AUTO_INCREMENT , 
`display_name` VARCHAR(20) NOT NULL , `user_name` VARCHAR(20) NOT NULL , 
`password` VARCHAR(60) NOT NULL , PRIMARY KEY (`id`), UNIQUE (`user_name`));