CREATE DATABASE `orpheos`;

-- TABLE CREATION

CREATE TABLE `orpheos`.`user` (
`id` INT NOT NULL AUTO_INCREMENT ,
`display_name` VARCHAR(20) NOT NULL ,
`user_name` VARCHAR(20) NOT NULL ,
`access_level` INT,
`password` VARCHAR(60) NOT NULL ,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`), UNIQUE (`user_name`));

CREATE TABLE `orpheos`.`category` (
`id` INT NOT NULL AUTO_INCREMENT ,
`name` VARCHAR(64) NOT NULL ,
`description` VARCHAR(255) ,
`parent` INT ,
PRIMARY KEY (`id`), FOREIGN KEY (`parent`) REFERENCES category(`id`) ON DELETE CASCADE);

CREATE TABLE `orpheos`.`project` (
`id` INT NOT NULL AUTO_INCREMENT ,
`name` VARCHAR(64) NOT NULL ,
`description` VARCHAR(255) ,
`category` INT ,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`), FOREIGN KEY (`category`) REFERENCES category(`id`));

CREATE TABLE `orpheos`.`project_member` (
`id` INT NOT NULL AUTO_INCREMENT ,
`project` INT NOT NULL,
`user` INT NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (`project`) REFERENCES project(`id`),
FOREIGN KEY (`user`) REFERENCES user(`id`)
);

CREATE TABLE `orpheos`.`post` (
`id` INT NOT NULL AUTO_INCREMENT ,
`title` VARCHAR(64) NOT NULL ,
`description` VARCHAR(255) ,
`user` INT ,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`), FOREIGN KEY (`user`) REFERENCES user(`id`));

CREATE TABLE `orpheos`.`post_comment` (
`id` INT NOT NULL AUTO_INCREMENT ,
`text` VARCHAR(255) ,
`user` INT NOT NULL,
`post` INT NOT NULL,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`),
FOREIGN KEY (`post`) REFERENCES post(`id`),
FOREIGN KEY (`user`) REFERENCES user(`id`));

CREATE TABLE `orpheos`.`picture` (
`id` INT NOT NULL AUTO_INCREMENT ,
`name` VARCHAR(64) NOT NULL ,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`id`));

CREATE TABLE `orpheos`.`post_picture` (
`id` INT NOT NULL AUTO_INCREMENT ,
`post` INT NOT NULL,
`picture` INT NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (`post`) REFERENCES picture(`id`),
FOREIGN KEY (`picture`) REFERENCES post(`id`)
);




--  Initial data setup

INSERT INTO `user` (`id`, `display_name`, `user_name`, `password`) VALUES (NULL, 'Admin', 'admin', '$2a$12$UqaXAflkcYz7wPxqnpp6HublPKx5Lopy6WP841.pc98yKxOaBIdt6');
