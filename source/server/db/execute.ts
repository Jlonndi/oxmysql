const hrtime = require('process').hrtime;
import { mysql_debug, mysql_slow_query_warning } from '../config';
import { isReady, scheduleTick, serverReady } from '../utils';
import pool from './pool';
import { preparedTypes, response } from './types';

export default async (invokingResource: string, query: string, parameters?: any[], cb?: Function) => {
  if (!isReady) serverReady();
  const type = preparedTypes(query);
  if (!type) throw new Error(`Prepared statements only accept SELECT, INSERT, UPDATE, and DELETE methods!`);

  scheduleTick();
  const connection = await pool.getConnection();
  try {
    const queryCount = parameters.length;
    let results = [];
    let executionTime = hrtime() as any;

    if (typeof parameters[0] !== 'object') {
      const [result] = (await connection.execute(query, parameters)) as any;
      results[0] = response(type, result);
    } else {
      for (let i = 0; i < queryCount; i++) {
        const [result] = (await connection.execute(query, parameters[i])) as any;
        results[i] = response(type, result);
      }
    }

    executionTime = hrtime(executionTime)[1] / 1000000;

    if (results.length === 1) {
      if (type === 'execute') {
        if (results[0][0] && Object.keys(results[0][0]).length === 1) results = Object.values(results[0][0])[0] as [];
        else results = results[0][0];
      } else {
        results = results[0];
      }
    }

    if (executionTime >= mysql_slow_query_warning || mysql_debug)
      console.log(
        `^3[${mysql_debug ? 'DEBUG' : 'WARNING'}] ${invokingResource} took ${executionTime}ms to execute ${
          queryCount > 1 ? queryCount + ' queries' : 'a query'
        }!
        ${query} ${JSON.stringify(parameters)}^0`
      );

    if (cb) {
      cb(results);
    } else {
      return results;
    }
  } catch (err) {
    throw new Error(`${invokingResource} was unable to execute a query!
    ${err.message}
    ${err.sql || `${query} ${JSON.stringify(parameters)}`}`);
  } finally {
    connection.release();
  }
};
