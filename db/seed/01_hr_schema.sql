-- Module 7 lab — Oracle HR sample schema (compact, self-contained load).
--
-- gvenzl/oracle-free runs init scripts as SYS connected to the CDB root (FREE),
-- so switch into the FREEPDB1 pluggable database before creating anything.
ALTER SESSION SET CONTAINER = FREEPDB1;

-- Schema owner for the HR sample data. Throwaway credential for a disposable local DB.
CREATE USER hr IDENTIFIED BY "Workshop_hr_2026" DEFAULT TABLESPACE USERS QUOTA UNLIMITED ON USERS;
GRANT CREATE SESSION TO hr;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
CREATE TABLE hr.regions (
  region_id    NUMBER       PRIMARY KEY,
  region_name  VARCHAR2(25)
);

CREATE TABLE hr.countries (
  country_id    CHAR(2)      PRIMARY KEY,
  country_name  VARCHAR2(40),
  region_id     NUMBER       REFERENCES hr.regions (region_id)
);

CREATE TABLE hr.locations (
  location_id     NUMBER(4)    PRIMARY KEY,
  street_address  VARCHAR2(40),
  postal_code     VARCHAR2(12),
  city            VARCHAR2(30) NOT NULL,
  state_province  VARCHAR2(25),
  country_id      CHAR(2)      REFERENCES hr.countries (country_id)
);

CREATE TABLE hr.jobs (
  job_id      VARCHAR2(10)  PRIMARY KEY,
  job_title   VARCHAR2(35)  NOT NULL,
  min_salary  NUMBER(6),
  max_salary  NUMBER(6)
);

-- manager_id references employees; the FK is added after employees are loaded
-- to break the circular dependency between departments and employees.
CREATE TABLE hr.departments (
  department_id    NUMBER(4)    PRIMARY KEY,
  department_name  VARCHAR2(30) NOT NULL,
  manager_id       NUMBER(6),
  location_id      NUMBER(4)    REFERENCES hr.locations (location_id)
);

CREATE TABLE hr.employees (
  employee_id     NUMBER(6)    PRIMARY KEY,
  first_name      VARCHAR2(20),
  last_name       VARCHAR2(25) NOT NULL,
  email           VARCHAR2(25) NOT NULL UNIQUE,
  phone_number    VARCHAR2(20),
  hire_date       DATE         NOT NULL,
  job_id          VARCHAR2(10) NOT NULL REFERENCES hr.jobs (job_id),
  salary          NUMBER(8,2),
  commission_pct  NUMBER(2,2),
  manager_id      NUMBER(6),
  department_id   NUMBER(4)    REFERENCES hr.departments (department_id)
);

CREATE TABLE hr.job_history (
  employee_id    NUMBER(6)    NOT NULL REFERENCES hr.employees (employee_id),
  start_date     DATE         NOT NULL,
  end_date       DATE         NOT NULL,
  job_id         VARCHAR2(10) NOT NULL REFERENCES hr.jobs (job_id),
  department_id  NUMBER(4)    REFERENCES hr.departments (department_id),
  CONSTRAINT job_history_pk PRIMARY KEY (employee_id, start_date)
);

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------
INSERT INTO hr.regions VALUES (1, 'Europe');
INSERT INTO hr.regions VALUES (2, 'Americas');
INSERT INTO hr.regions VALUES (3, 'Asia');
INSERT INTO hr.regions VALUES (4, 'Middle East and Africa');

INSERT INTO hr.countries VALUES ('US', 'United States of America', 2);
INSERT INTO hr.countries VALUES ('CA', 'Canada', 2);
INSERT INTO hr.countries VALUES ('UK', 'United Kingdom', 1);
INSERT INTO hr.countries VALUES ('DE', 'Germany', 1);
INSERT INTO hr.countries VALUES ('IN', 'India', 3);
INSERT INTO hr.countries VALUES ('AU', 'Australia', 3);

INSERT INTO hr.locations VALUES (1400, '2014 Jabberwocky Rd', '26192', 'Southlake', 'Texas', 'US');
INSERT INTO hr.locations VALUES (1500, '2011 Interiors Blvd', '99236', 'South San Francisco', 'California', 'US');
INSERT INTO hr.locations VALUES (1700, '2004 Charade Rd', '98199', 'Seattle', 'Washington', 'US');
INSERT INTO hr.locations VALUES (1800, '460 Bloor St. W.', 'ON M5S 1X8', 'Toronto', 'Ontario', 'CA');
INSERT INTO hr.locations VALUES (2400, '8204 Arthur St', NULL, 'London', NULL, 'UK');

INSERT INTO hr.jobs VALUES ('AD_PRES', 'President', 20000, 40000);
INSERT INTO hr.jobs VALUES ('AD_VP', 'Administration Vice President', 15000, 30000);
INSERT INTO hr.jobs VALUES ('AD_ASST', 'Administration Assistant', 3000, 6000);
INSERT INTO hr.jobs VALUES ('IT_PROG', 'Programmer', 4000, 10000);
INSERT INTO hr.jobs VALUES ('FI_MGR', 'Finance Manager', 8200, 16000);
INSERT INTO hr.jobs VALUES ('FI_ACCOUNT', 'Accountant', 4200, 9000);
INSERT INTO hr.jobs VALUES ('AC_MGR', 'Accounting Manager', 8200, 16000);
INSERT INTO hr.jobs VALUES ('SA_MAN', 'Sales Manager', 10000, 20000);
INSERT INTO hr.jobs VALUES ('SA_REP', 'Sales Representative', 6000, 12000);
INSERT INTO hr.jobs VALUES ('MK_MAN', 'Marketing Manager', 9000, 15000);
INSERT INTO hr.jobs VALUES ('MK_REP', 'Marketing Representative', 4000, 9000);
INSERT INTO hr.jobs VALUES ('ST_MAN', 'Stock Manager', 5500, 8500);
INSERT INTO hr.jobs VALUES ('SH_CLERK', 'Shipping Clerk', 2500, 5500);

INSERT INTO hr.departments VALUES (10, 'Administration', 200, 1700);
INSERT INTO hr.departments VALUES (20, 'Marketing', 201, 1800);
INSERT INTO hr.departments VALUES (50, 'Shipping', 124, 1500);
INSERT INTO hr.departments VALUES (60, 'IT', 103, 1400);
INSERT INTO hr.departments VALUES (80, 'Sales', 145, 2400);
INSERT INTO hr.departments VALUES (90, 'Executive', 100, 1700);
INSERT INTO hr.departments VALUES (100, 'Finance', 108, 1700);
INSERT INTO hr.departments VALUES (110, 'Accounting', 205, 1700);

-- ---------------------------------------------------------------------------
-- Employees (Steven King is the CEO and has no manager; 178 has no department)
-- ---------------------------------------------------------------------------
INSERT INTO hr.employees VALUES (100, 'Steven', 'King', 'SKING', '515.123.4567', DATE '2003-06-17', 'AD_PRES', 24000, NULL, NULL, 90);
INSERT INTO hr.employees VALUES (101, 'Neena', 'Kochhar', 'NKOCHHAR', '515.123.4568', DATE '2005-09-21', 'AD_VP', 17000, NULL, 100, 90);
INSERT INTO hr.employees VALUES (102, 'Lex', 'De Haan', 'LDEHAAN', '515.123.4569', DATE '2001-01-13', 'AD_VP', 17000, NULL, 100, 90);
INSERT INTO hr.employees VALUES (103, 'Alexander', 'Hunold', 'AHUNOLD', '590.423.4567', DATE '2006-01-03', 'IT_PROG', 9000, NULL, 102, 60);
INSERT INTO hr.employees VALUES (104, 'Bruce', 'Ernst', 'BERNST', '590.423.4568', DATE '2007-05-21', 'IT_PROG', 6000, NULL, 103, 60);
INSERT INTO hr.employees VALUES (107, 'Diana', 'Lorentz', 'DLORENTZ', '590.423.5567', DATE '2007-02-07', 'IT_PROG', 4200, NULL, 103, 60);
INSERT INTO hr.employees VALUES (108, 'Nancy', 'Greenberg', 'NGREENBE', '515.124.4569', DATE '2002-08-17', 'FI_MGR', 12008, NULL, 101, 100);
INSERT INTO hr.employees VALUES (109, 'Daniel', 'Faviet', 'DFAVIET', '515.124.4169', DATE '2002-08-16', 'FI_ACCOUNT', 9000, NULL, 108, 100);
INSERT INTO hr.employees VALUES (124, 'Kevin', 'Mourgos', 'KMOURGOS', '650.123.5234', DATE '2007-11-16', 'ST_MAN', 5800, NULL, 100, 50);
INSERT INTO hr.employees VALUES (141, 'Trenna', 'Rajs', 'TRAJS', '650.121.8009', DATE '2006-10-17', 'SH_CLERK', 3500, NULL, 124, 50);
INSERT INTO hr.employees VALUES (145, 'John', 'Russell', 'JRUSSEL', '011.44.1344.429268', DATE '2004-10-01', 'SA_MAN', 14000, 0.4, 100, 80);
INSERT INTO hr.employees VALUES (146, 'Karen', 'Partners', 'KPARTNER', '011.44.1344.467268', DATE '2005-01-05', 'SA_MAN', 13500, 0.3, 100, 80);
INSERT INTO hr.employees VALUES (150, 'Peter', 'Tucker', 'PTUCKER', '011.44.1344.129268', DATE '2005-01-30', 'SA_REP', 10000, 0.3, 145, 80);
INSERT INTO hr.employees VALUES (151, 'David', 'Bernstein', 'DBERNSTE', '011.44.1344.345268', DATE '2005-03-24', 'SA_REP', 9500, 0.25, 145, 80);
INSERT INTO hr.employees VALUES (176, 'Jonathon', 'Taylor', 'JTAYLOR', '011.44.1644.429265', DATE '2006-03-24', 'SA_REP', 8600, 0.2, 145, 80);
INSERT INTO hr.employees VALUES (178, 'Kimberely', 'Grant', 'KGRANT', '011.44.1644.429263', DATE '2007-05-24', 'SA_REP', 7000, 0.15, 145, NULL);
INSERT INTO hr.employees VALUES (200, 'Jennifer', 'Whalen', 'JWHALEN', '515.123.4444', DATE '2003-09-17', 'AD_ASST', 4400, NULL, 101, 10);
INSERT INTO hr.employees VALUES (201, 'Michael', 'Hartstein', 'MHARTSTE', '515.123.5555', DATE '2004-02-17', 'MK_MAN', 13000, NULL, 100, 20);
INSERT INTO hr.employees VALUES (202, 'Pat', 'Fay', 'PFAY', '603.123.6666', DATE '2005-08-17', 'MK_REP', 6000, NULL, 201, 20);
INSERT INTO hr.employees VALUES (205, 'Shelley', 'Higgins', 'SHIGGINS', '515.123.8080', DATE '2002-06-07', 'AC_MGR', 12008, NULL, 101, 110);
INSERT INTO hr.employees VALUES (206, 'William', 'Gietz', 'WGIETZ', '515.123.8181', DATE '2002-06-07', 'FI_ACCOUNT', 8300, NULL, 205, 110);

-- Now that employees exist, add the two circular manager foreign keys.
ALTER TABLE hr.employees   ADD CONSTRAINT emp_manager_fk  FOREIGN KEY (manager_id) REFERENCES hr.employees (employee_id);
ALTER TABLE hr.departments ADD CONSTRAINT dept_manager_fk FOREIGN KEY (manager_id) REFERENCES hr.employees (employee_id);

INSERT INTO hr.job_history VALUES (101, DATE '2001-10-28', DATE '2005-03-15', 'AC_MGR', 110);
INSERT INTO hr.job_history VALUES (200, DATE '1995-07-01', DATE '2001-06-17', 'AD_ASST', 90);
INSERT INTO hr.job_history VALUES (176, DATE '2006-03-24', DATE '2007-12-31', 'SA_REP', 80);

COMMIT;
