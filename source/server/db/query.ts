import { scheduleTick, parseArguments, isReady, serverReady } from '../utils';
import { mysql_debug, mysql_slow_query_warning } from '../config';
import { response } from './types';
import pool from './pool';

export const _query = async (type: string, invokingResource: string, query: string, parameters?: [], cb?: Function) => {
  if (!isReady) serverReady();
  [query, parameters, cb] = parseArguments(invokingResource, query, parameters, cb);
  scheduleTick();
  try {
    const [result, _, executionTime] = (await pool.query(query, parameters)) as any;

    if (executionTime >= mysql_slow_query_warning || mysql_debug)
      console.log(
        `^3[${mysql_debug ? 'DEBUG' : 'WARNING'}] ${invokingResource} took ${executionTime}ms to execute a query!
      ${query} ${JSON.stringify(parameters)}^0`
      );
    if (cb) {
      cb(response(type, result));
    } else {
      return response(type, result);
    }
  } catch (err) {
    throw new Error(`${invokingResource} was unable to execute a query!
    ${err.message}
    ${err.sql || `${query} ${JSON.stringify(parameters)}`}`);
  }
};
