-- Module 7 lab — least-privilege user for the MCP server.
--
-- Init scripts run as SYS in the CDB root, so switch into FREEPDB1 first.
ALTER SESSION SET CONTAINER = FREEPDB1;

-- This is the ONLY account the MCP server uses. It can start a session and read
-- the HR tables — nothing else. No quota, no CREATE, no INSERT/UPDATE/DELETE.
-- This is the real guardrail: even if the agent sends a DELETE, Oracle rejects it.
CREATE USER hr_ro IDENTIFIED BY "Workshop_ro_2026";
GRANT CREATE SESSION TO hr_ro;

GRANT SELECT ON hr.regions      TO hr_ro;
GRANT SELECT ON hr.countries    TO hr_ro;
GRANT SELECT ON hr.locations    TO hr_ro;
GRANT SELECT ON hr.jobs         TO hr_ro;
GRANT SELECT ON hr.departments  TO hr_ro;
GRANT SELECT ON hr.employees    TO hr_ro;
GRANT SELECT ON hr.job_history  TO hr_ro;
