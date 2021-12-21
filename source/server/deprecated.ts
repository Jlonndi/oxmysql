import sql_execute from './db/execute';
import sql_query from './db/query';
import sql_transaction from './db/transaction';

let deprecated = (invokingResource: string) => {
  setTimeout(() => {
    console.log(
      `^3[WARNING] ${invokingResource} triggered a deprecated function! Exports from prior to v2.0.0 will be removed in a future update.
      Refer to the readme for information on updating.^0`
    );
  }, 500);
  deprecated = undefined;
};

global.exports('execute', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_query('', invokingResource, query, parameters, cb);
});

global.exports('executeSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_query('', invokingResource, query, parameters);
});

global.exports('single', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_query('single', invokingResource, query, parameters, cb);
});

global.exports('singleSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_query('single', invokingResource, query, parameters);
});

global.exports('scalar', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_query('scalar', invokingResource, query, parameters, cb);
});

global.exports('scalarSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_query('scalar', invokingResource, query, parameters);
});

global.exports('update', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_query('update', invokingResource, query, parameters, cb);
});

global.exports('updateSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_query('update', invokingResource, query, parameters);
});

global.exports('insert', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_query('insert', invokingResource, query, parameters, cb);
});

global.exports('insertSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_query('insert', invokingResource, query, parameters);
});

global.exports('transaction', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_transaction(invokingResource, query, parameters, cb);
});

global.exports('transactionSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_transaction(invokingResource, query, parameters);
});

global.exports('prepare', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  sql_execute(invokingResource, query, parameters, cb);
});

global.exports('prepareSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  if (deprecated !== undefined) deprecated(invokingResource);
  return sql_execute(invokingResource, query, parameters);
});
