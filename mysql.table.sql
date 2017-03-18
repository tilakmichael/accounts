SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS accounts DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE accounts;

CREATE TABLE accdoc (
  id int(11) NOT NULL,
  code varchar(3) NOT NULL,
  docno int(8) NOT NULL,
  docdate date NOT NULL,
  orgid int(11) NOT NULL,
  prdid int(11) NOT NULL,
  refno varchar(20) DEFAULT NULL,
  refdate date DEFAULT NULL,
  describ varchar(600) DEFAULT NULL,
  amount decimal(12,0) DEFAULT NULL,
  status varchar(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE accdocdet (
  id int(11) NOT NULL,
  docid int(11) NOT NULL,
  glid int(11) NOT NULL,
  slid int(11) DEFAULT NULL,
  describ varchar(120) DEFAULT NULL,
  amount decimal(12,0) NOT NULL,
  crdr varchar(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE accgl (
  id int(11) NOT NULL,
  orgid int(11) NOT NULL,
  gltypeid int(11) NOT NULL,
  name varchar(30) NOT NULL,
  crdr varchar(1) NOT NULL,
  bookledger varchar(2) DEFAULT NULL,
  book varchar(5) DEFAULT NULL,
  ledger varchar(5) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE accorgs (
  id int(11) NOT NULL,
  name varchar(60) NOT NULL,
  address1 varchar(30) DEFAULT NULL,
  address2 varchar(30) DEFAULT NULL,
  city varchar(30) DEFAULT NULL,
  state varchar(30) DEFAULT NULL,
  country varchar(30) DEFAULT NULL,
  postal varchar(10) DEFAULT NULL,
  phone varchar(15) NOT NULL,
  email varchar(60) DEFAULT NULL,
  web varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE accperiod (
  id int(11) NOT NULL,
  orgid int(11) NOT NULL,
  startdt date NOT NULL,
  enddt date NOT NULL,
  status varchar(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE accsl (
  name varchar(60) NOT NULL,
  glid int(11) NOT NULL,
  slcode varchar(3) NOT NULL,
  address1 varchar(60) DEFAULT NULL,
  address2 varchar(60) DEFAULT NULL,
  city varchar(60) DEFAULT NULL,
  state varchar(60) DEFAULT NULL,
  country int(11) DEFAULT NULL,
  pin int(6) DEFAULT NULL,
  phone int(11) DEFAULT NULL,
  contact varchar(60) DEFAULT NULL,
  email varchar(60) DEFAULT NULL,
  id int(11) NOT NULL,
  orgid int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE accslbooks (
  id int(11) NOT NULL,
  code varchar(3) NOT NULL,
  name varchar(60) NOT NULL,
  glid int(11) NOT NULL,
  orgid int(11) NOT NULL,
  crdr varchar(1) DEFAULT NULL,
  type varchar(2) DEFAULT NULL,
  ref_number varchar(16) DEFAULT NULL,
  address varchar(60) DEFAULT NULL,
  city varchar(60) DEFAULT NULL,
  state varchar(60) DEFAULT NULL,
  country int(11) DEFAULT NULL,
  person varchar(60) DEFAULT NULL,
  phone varchar(16) DEFAULT NULL,
  email varchar(60) DEFAULT NULL,
  web varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE acctypes (
  id int(11) NOT NULL,
  name varchar(30) NOT NULL,
  crdr varchar(1) NOT NULL,
  refid int(11) DEFAULT NULL,
  seq int(3) NOT NULL,
  level int(2) NOT NULL,
  orgid int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE lookups (
  id int(11) NOT NULL,
  name varchar(30) NOT NULL,
  seq int(3) DEFAULT NULL,
  refid int(11) DEFAULT NULL,
  type varchar(5) NOT NULL,
  seeded varchar(1) NOT NULL DEFAULT 'N'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


ALTER TABLE accdoc
  ADD PRIMARY KEY (id);

ALTER TABLE accdocdet
  ADD PRIMARY KEY (id);

ALTER TABLE accgl
  ADD PRIMARY KEY (id);

ALTER TABLE accorgs
  ADD PRIMARY KEY (id);

ALTER TABLE accperiod
  ADD PRIMARY KEY (id);

ALTER TABLE accsl
  ADD PRIMARY KEY (id);

ALTER TABLE accslbooks
  ADD PRIMARY KEY (id);

ALTER TABLE acctypes
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (refid,name,orgid) USING BTREE;

ALTER TABLE lookups
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name (type,refid,name) USING BTREE,
  ADD UNIQUE KEY seq (type,refid,seq) USING BTREE;


ALTER TABLE accdoc
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE accdocdet
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE accgl
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE accorgs
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE accperiod
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE accsl
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE accslbooks
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE acctypes
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE lookups
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;
