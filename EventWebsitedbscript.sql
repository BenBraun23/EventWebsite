-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema eventwebsite
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema eventwebsite
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `eventwebsite` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `eventwebsite` ;

-- -----------------------------------------------------
-- Table `eventwebsite`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`locations` (
  `lname` VARCHAR(30) NOT NULL,
  `address` VARCHAR(30) NULL DEFAULT NULL,
  `longitude` FLOAT NULL DEFAULT NULL,
  `latitude` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`lname`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`universities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`universities` (
  `name` VARCHAR(40) NOT NULL,
  `lname` VARCHAR(30) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `numstudents` INT NULL DEFAULT NULL,
  PRIMARY KEY (`name`),
  INDEX `lname` (`lname` ASC) VISIBLE,
  CONSTRAINT `universities_ibfk_1`
    FOREIGN KEY (`lname`)
    REFERENCES `eventwebsite`.`locations` (`lname`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`users` (
  `uid` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NULL DEFAULT NULL,
  `password` VARCHAR(40) NULL DEFAULT NULL,
  `role` VARCHAR(45) NULL DEFAULT NULL,
  `university` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`uid`),
  INDEX `users_ibfk_1_idx` (`university` ASC) VISIBLE,
  CONSTRAINT `users_ibfk_1`
    FOREIGN KEY (`university`)
    REFERENCES `eventwebsite`.`universities` (`name`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`admins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`admins` (
  `aid` INT NOT NULL AUTO_INCREMENT,
  INDEX `admins_ibfk_1` (`aid` ASC) VISIBLE,
  CONSTRAINT `admins_ibfk_1`
    FOREIGN KEY (`aid`)
    REFERENCES `eventwebsite`.`users` (`uid`))
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`events` (
  `eid` INT NOT NULL AUTO_INCREMENT,
  `lname` VARCHAR(30) NULL DEFAULT NULL,
  `time` VARCHAR(10) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `university` VARCHAR(45) NULL DEFAULT NULL,
  `day` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`eid`),
  UNIQUE INDEX `No_Overlap` (`lname` ASC, `time` ASC) VISIBLE,
  UNIQUE INDEX `lname` (`lname` ASC, `time` ASC, `day` ASC) VISIBLE,
  INDEX `events_ibfk_2_idx` (`university` ASC) VISIBLE,
  CONSTRAINT `events_ibfk_1`
    FOREIGN KEY (`lname`)
    REFERENCES `eventwebsite`.`locations` (`lname`),
  CONSTRAINT `events_ibfk_2`
    FOREIGN KEY (`university`)
    REFERENCES `eventwebsite`.`universities` (`name`))
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`comments` (
  `uid` INT NULL DEFAULT NULL,
  `eid` INT NULL DEFAULT NULL,
  `cid` INT NOT NULL AUTO_INCREMENT,
  `text` TEXT NULL DEFAULT NULL,
  `rating` INT NULL DEFAULT NULL,
  `time` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`cid`),
  INDEX `comments_ibfk_2_idx` (`eid` ASC) VISIBLE,
  INDEX `comments_ibfk_1_idx` (`uid` ASC) VISIBLE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`uid`)
    REFERENCES `eventwebsite`.`users` (`uid`),
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`eid`)
    REFERENCES `eventwebsite`.`events` (`eid`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`superadmins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`superadmins` (
  `sid` INT NOT NULL AUTO_INCREMENT,
  INDEX `superadmins_ibfk_1` (`sid` ASC) VISIBLE,
  CONSTRAINT `superadmins_ibfk_1`
    FOREIGN KEY (`sid`)
    REFERENCES `eventwebsite`.`users` (`uid`))
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`privateevents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`privateevents` (
  `eid` INT NOT NULL,
  `sid` INT NULL DEFAULT NULL,
  INDEX `privateevents_ibfk_1_idx` (`eid` ASC) VISIBLE,
  INDEX `privateevents_ibfk_2_idx` (`sid` ASC) VISIBLE,
  CONSTRAINT `privateevents_ibfk_1`
    FOREIGN KEY (`eid`)
    REFERENCES `eventwebsite`.`events` (`eid`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `privateevents_ibfk_2`
    FOREIGN KEY (`sid`)
    REFERENCES `eventwebsite`.`superadmins` (`sid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`publicevents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`publicevents` (
  `eid` INT NULL DEFAULT NULL,
  `sid` INT NULL DEFAULT NULL,
  INDEX `publicevents_ibfk_1_idx` (`eid` ASC) VISIBLE,
  INDEX `publicevents_ibfk_2_idx` (`sid` ASC) VISIBLE,
  CONSTRAINT `publicevents_ibfk_1`
    FOREIGN KEY (`eid`)
    REFERENCES `eventwebsite`.`events` (`eid`),
  CONSTRAINT `publicevents_ibfk_2`
    FOREIGN KEY (`sid`)
    REFERENCES `eventwebsite`.`superadmins` (`sid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`rsos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`rsos` (
  `rid` INT NOT NULL AUTO_INCREMENT,
  `aid` INT NULL DEFAULT NULL,
  `active` TINYINT(1) NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `university` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `aid` (`aid` ASC) VISIBLE,
  INDEX `rsos_ibfk_2_idx` (`university` ASC) VISIBLE,
  CONSTRAINT `rsos_ibfk_1`
    FOREIGN KEY (`aid`)
    REFERENCES `eventwebsite`.`admins` (`aid`),
  CONSTRAINT `rsos_ibfk_2`
    FOREIGN KEY (`university`)
    REFERENCES `eventwebsite`.`universities` (`name`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`rsoevents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`rsoevents` (
  `eid` INT NULL DEFAULT NULL,
  `rid` INT NULL DEFAULT NULL,
  INDEX `eid` (`eid` ASC) VISIBLE,
  INDEX `rid` (`rid` ASC) VISIBLE,
  CONSTRAINT `rsoevents_ibfk_1`
    FOREIGN KEY (`eid`)
    REFERENCES `eventwebsite`.`events` (`eid`),
  CONSTRAINT `rsoevents_ibfk_2`
    FOREIGN KEY (`rid`)
    REFERENCES `eventwebsite`.`rsos` (`rid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `eventwebsite`.`students_rsos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventwebsite`.`students_rsos` (
  `uid` INT NULL DEFAULT NULL,
  `rid` INT NULL DEFAULT NULL,
  INDEX `uid` (`uid` ASC) VISIBLE,
  INDEX `rid` (`rid` ASC) VISIBLE,
  CONSTRAINT `students_rsos_ibfk_1`
    FOREIGN KEY (`uid`)
    REFERENCES `eventwebsite`.`users` (`uid`),
  CONSTRAINT `students_rsos_ibfk_2`
    FOREIGN KEY (`rid`)
    REFERENCES `eventwebsite`.`rsos` (`rid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `eventwebsite`;

DELIMITER $$
USE `eventwebsite`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `eventwebsite`.`RSOStatusUpdateA`
AFTER INSERT ON `eventwebsite`.`students_rsos`
FOR EACH ROW
BEGIN     
 IF ((SELECT COUNT(*)
 FROM Students_RSOs M
 WHERE M.rid = NEW.rid) > 4)
THEN   
 UPDATE RSOs     
 SET active=true
 WHERE rid = NEW.rid;
END IF;
 END$$

USE `eventwebsite`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `eventwebsite`.`RSOStatusUpdateP`
AFTER DELETE ON `eventwebsite`.`students_rsos`
FOR EACH ROW
BEGIN     
 IF ((SELECT COUNT(*)
 FROM Students_RSOs M
 WHERE M.rid = OLD.rid) < 5)
THEN   
 UPDATE RSOs     
 SET active=false   
 WHERE rid = OLD.rid;
END IF;
 END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
