import { resourceName } from './config';
const convertNamedPlaceholders = require('named-placeholders')();

export const scheduleTick = () => {
  ScheduleResourceTick(resourceName);
};

export let isReady = false;
let callbacks = [];

export let serverReady = async () => {
  return new Promise((resolve) => {
    if (callbacks.length === 0) {
      callbacks.push(resolve);
      const id = setInterval(() => {
        if (GetResourceState(resourceName) == 'started') {
          for (let i = 1; i < callbacks.length; i++) {
            callbacks[i]();
          }
          resolve(id);
        }
      }, 50);
    } else callbacks.push(resolve);
  }).then((id?: any) => {
    if (id) {
      clearInterval(id);
      isReady = true;
      serverReady = undefined;
    }
  });
};

export const parseArguments = (invokingResource: string, query: string, parameters: Object, cb?: Function): any => {
  if (typeof query !== 'string') throw new Error(`Query expected a string but received ${typeof query} instead`);

  const queryParams = query.match(/\?(?!\?)/g);

  if (query.includes(':') || query.includes('@')) {
    const placeholders = convertNamedPlaceholders(query, parameters);
    query = placeholders[0];
    parameters = placeholders[1];
  }

  if (cb && typeof cb !== 'function') {
    cb = undefined;
  }

  if (parameters && typeof parameters === 'function') {
    cb = parameters;
    parameters = [];
  } else if (parameters === null || parameters === undefined) parameters = [];

  if (!Array.isArray(parameters)) {
    let arr = [];
    Object.entries(parameters).forEach((entry) => {
      const [key, value]: any = entry;
      arr[key - 1] = value;
    });
    parameters = arr;
  } else if (queryParams !== null) {
    if (parameters.length === 0) {
      for (let i = 0; i < queryParams.length; i++) parameters[i] = null;
      return [query, parameters, cb];
    }
    const diff = queryParams.length - parameters.length;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) parameters[queryParams.length + i] = null;
    } else if (diff < 0) {
      throw new Error(`${invokingResource} was unable to execute a query!
        Expected ${queryParams.length} parameters, but received ${parameters.length}.
        ${`${query} ${JSON.stringify(parameters)}`}`);
    }
  }

  return [query, parameters, cb];
};

export const parseTransaction = (invokingResource: string, queries: any, parameters: []) => {
  //https://github.com/GHMatti/ghmattimysql/blob/37f1d2ae5c53f91782d168fe81fba80512d3c46d/packages/ghmattimysql/src/server/utility/sanitizeTransactionInput.ts#L5

  if (!Array.isArray(queries)) throw new Error(`Transaction queries must be array type`);

  const parsedTransaction = queries.map((query) => {
    const [parsedQuery, parsedParameters] = parseArguments(
      invokingResource,
      typeof query === 'object' ? query.query : query,
      (typeof query === 'object' && (query.parameters || query.values)) || parameters || []
    );
    return { query: parsedQuery, params: parsedParameters };
  });

  return parsedTransaction;
};
