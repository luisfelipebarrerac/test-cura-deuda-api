DROP DATABASE IF EXISTS sepo_mex_db;
CREATE DATABASE sepo_mex_db;
USE sepo_mex_db;



DROP TABLE IF EXISTS user;
CREATE TABLE user (
  -- specific fields
  id               INT             NOT NULL    AUTO_INCREMENT,
  username         VARCHAR(50)     NOT NULL,
  password         VARCHAR(200)    NOT NULL,
  salt             VARCHAR(50)     NOT NULL,

  -- common fields
  created_on       TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
  
  -- keys
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS state;
CREATE TABLE state (
  -- specific fields
  id                   INT             NOT NULL    AUTO_INCREMENT,
  d_estado             VARCHAR(150)     NULL,
  c_estado             VARCHAR(20)     NULL,

  -- common fields
  created_on  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
  modified_on TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,

  -- keys
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS municipality;
CREATE TABLE municipality (
  -- specific fields
  id                   INT              NOT NULL    AUTO_INCREMENT,
  state_id             INT              NOT NULL,
  D_mnpio              VARCHAR(150)     NULL,
  c_mnpio              VARCHAR(20)      NULL,

  -- common fields
  created_on  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
  modified_on TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,

  -- keys
  PRIMARY KEY (id),
  FOREIGN KEY (state_id) REFERENCES state (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS city;
CREATE TABLE city (
  -- specific fields
  id                   INT              NOT NULL    AUTO_INCREMENT,
  municipality_id      INT              NOT NULL,
  d_ciudad             VARCHAR(150)     NULL,
  c_cve_ciudad         VARCHAR(20)      NULL,

  -- common fields
  created_on  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
  modified_on TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,

  -- keys
  PRIMARY KEY (id),
  FOREIGN KEY (municipality_id) REFERENCES municipality (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

DROP TABLE IF EXISTS settlement;
CREATE TABLE settlement (
  -- specific fields
  id                   INT              NOT NULL    AUTO_INCREMENT,
  municipality_id      INT              NOT NULL,
  d_codigo             VARCHAR(20)      NULL,
  d_asenta             TEXT             NULL,
  d_tipo_asenta        VARCHAR(150)     NULL,
  d_CP                 VARCHAR(20)      NULL,
  c_oficina            VARCHAR(20)      NULL,
  c_tipo_asenta        VARCHAR(20)      NULL,
  id_asenta_cpcons     VARCHAR(20)      NULL,
  d_zona               VARCHAR(150)     NULL,

  -- common fields
  created_on  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,
  modified_on TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP,

  -- keys
  PRIMARY KEY (id),
  FOREIGN KEY (municipality_id) REFERENCES municipality (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

