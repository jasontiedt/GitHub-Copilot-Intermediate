// Read-only MCP server for the Oracle HR sample schema (Module 7 lab).
//
// One tool, `run_query`, runs a SELECT and returns rows as JSON. It connects as a
// least-privilege read-only user (hr_ro), so the database — not this code — is what
// guarantees the agent can only read. Log to stderr only: stdout is the JSON-RPC channel.
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import oracledb from 'oracledb';
import * as z from 'zod/v4';

const ORACLE_USER = process.env.ORACLE_USER || 'hr_ro';
const ORACLE_CONNECT_STRING = process.env.ORACLE_CONNECT_STRING || 'localhost:1521/FREEPDB1';

function createServer(): McpServer {
  const server = new McpServer({ name: 'taskflow-oracle', version: '1.0.0' });

  server.registerTool(
    'run_query',
    {
      description:
        'Run a read-only SQL SELECT against the Oracle HR sample schema and return the rows as JSON. ' +
        'The connection is a least-privilege read-only user, so only SELECT statements succeed. ' +
        'Unqualified table names resolve to the HR schema (e.g. employees, departments, jobs).',
      inputSchema: z.object({
        sql: z
          .string()
          .describe('A single SQL SELECT statement, without a trailing semicolon.'),
      }),
    },
    async ({ sql }) => {
      const password = process.env.ORACLE_PASSWORD;
      if (!password) {
        return {
          content: [
            {
              type: 'text',
              text: 'ORACLE_PASSWORD is not set. Start this server from the lab mcp.json so the password prompt is supplied.',
            },
          ],
          isError: true,
        };
      }

      let connection: oracledb.Connection | undefined;
      try {
        connection = await oracledb.getConnection({
          user: ORACLE_USER,
          password,
          connectString: ORACLE_CONNECT_STRING,
        });
        // Resolve unqualified names against HR without granting any write access.
        await connection.execute('ALTER SESSION SET CURRENT_SCHEMA = HR');
        const result = await connection.execute(sql, [], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          maxRows: 200,
        });
        return { content: [{ type: 'text', text: JSON.stringify(result.rows ?? [], null, 2) }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text', text: `Query failed: ${message}` }], isError: true };
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch {
            // Ignore close errors.
          }
        }
      }
    },
  );

  return server;
}

void serveStdio(createServer);
console.error('taskflow-oracle MCP server running on stdio');
