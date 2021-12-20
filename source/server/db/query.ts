import { mysql_debug, mysql_slow_query_warning } from '../config';
import { isReady, parseArguments, scheduleTick, serverReady } from '../utils';
import pool from './pool';
import { response } from './types';

export default async (type: string, invokingResource: string, query: string, parameters?: [], cb?: Function) => {
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
