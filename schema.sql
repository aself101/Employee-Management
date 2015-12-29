-- MySQL dump 10.11
--
-- Host: localhost    Database: #####
-- ------------------------------------------------------
-- Server version	5.0.95

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `Id` int(8) NOT NULL auto_increment,
  `Author` varchar(155) NOT NULL,
  `Comment` text NOT NULL,
  `Date` varchar(75) NOT NULL,
  `Fname` varchar(55) default NULL,
  `Lname` varchar(55) default NULL,
  PRIMARY KEY  (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee` (
  `Id` int(8) NOT NULL auto_increment,
  `firstName` varchar(55) NOT NULL,
  `lastName` varchar(75) NOT NULL,
  `EmployeeId` varchar(10) default NULL,
  `Email` varchar(155) default NULL,
  `PositionId` varchar(10) default NULL,
  `HireDate` varchar(55) default NULL,
  `StartDate` varchar(55) default NULL,
  `EndDate` varchar(55) default NULL,
  `Manager` varchar(130) default NULL,
  `AccountName` varchar(76) default NULL,
  `DisplayName` varchar(131) default NULL,
  `Permission` varchar(15) NOT NULL,
  PRIMARY KEY  (`Id`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `EmployeeId` (`EmployeeId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fields`
--

DROP TABLE IF EXISTS `fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fields` (
  `Id` int(8) NOT NULL auto_increment,
  `Label` varchar(75) NOT NULL,
  `FieldId` varchar(75) NOT NULL,
  `Type` varchar(35) NOT NULL,
  `FormName` varchar(75) NOT NULL,
  `Department` varchar(125) default NULL,
  `FieldValues` blob,
  `Permission` varchar(15) default NULL,
  PRIMARY KEY  (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=322 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pos`
--

DROP TABLE IF EXISTS `pos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pos` (
  `Id` int(8) NOT NULL auto_increment,
  `PId` varchar(10) default NULL,
  `PTitle` varchar(75) default NULL,
  `PLocation` varchar(75) default NULL,
  `PState` varchar(75) default NULL,
  `PCompany` varchar(75) default NULL,
  `PAddress` varchar(75) default NULL,
  `PDepartment` varchar(75) default NULL,
  `PCountry` varchar(55) default NULL,
  PRIMARY KEY  (`Id`),
  UNIQUE KEY `PId` (`PId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Table structure for table `requirements`
--

DROP TABLE IF EXISTS `requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requirements` (
  `Id` int(8) NOT NULL auto_increment,
  `Requirement` varchar(255) default NULL,
  `Department` varchar(55) default NULL,
  `Date` varchar(75) default NULL,
  `Value` varchar(355) default NULL,
  `EId` varchar(10) NOT NULL,
  `FormName` varchar(75) default NULL,
  PRIMARY KEY  (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
