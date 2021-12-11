import { mysql_debug, mysql_slow_query_warning } from '../config';
import { isReady, parseTransaction, scheduleTick, serverReady } from '../utils';
import pool from './pool';
const process = require('process');

const transactionError = (queries: any, parameters: any) =>
  `${queries
    .map((query) =>
      typeof query === 'string' ? query : `${query.query} ${JSON.stringify(query.values || query.parameters || [])}`
    )
    .join('\n')}\n${JSON.stringify(parameters)}`;

export const _transaction = async (invokingResource: string, queries: string, parameters: [], cb: Function) => {
  if (!isReady) serverReady();
  const parsedQuery = parseTransaction(invokingResource, queries, parameters);
  scheduleTick();
  const connection = await pool.getConnection();
  try {
    let queryCount = parameters.length;
    let results = [];
    let executionTime = process.hrtime();

    await connection.beginTransaction();

    for (let i = 0; i < queryCount; i++) {
      await connection.query(parsedQuery[i].query, parsedQuery[i].params);
    }

    await connection.commit();

    executionTime = process.hrtime(executionTime)[1] / 1000000;
    if (executionTime >= mysql_slow_query_warning || mysql_debug)
      console.log(
        `^3[${
          mysql_debug ? 'DEBUG' : 'WARNING'
        }] ${invokingResource} took ${executionTime}ms to execute a transaction!\n${transactionError(
          queries,
          parameters
        )}^0`
      );

    if (cb) {
      cb(results);
    } else {
      return results;
    }
  } catch (error) {
    await connection.rollback();
    console.log(
      `^1[ERROR] ${invokingResource} was unable to execute a transaction!
            ${error.message}
            ${error.sql || `${transactionError(queries, parameters)}`}^0`
    );
  } finally {
    connection.release();
  }
};
