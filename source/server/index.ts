import sql_execute from './db/execute';
import sql_query from './db/query';
import sql_transaction from './db/transaction';
require('./db/test');
require('./deprecated');

global.exports('query_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_query('', invokingResource, query, parameters, cb);
});

global.exports('query_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_query('', invokingResource, query, parameters);
});

global.exports('single_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_query('single', invokingResource, query, parameters, cb);
});

global.exports('single_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_query('single', invokingResource, query, parameters);
});

global.exports('scalar_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_query('scalar', invokingResource, query, parameters, cb);
});

global.exports('scalar_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_query('scalar', invokingResource, query, parameters);
});

global.exports('update_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_query('update', invokingResource, query, parameters, cb);
});

global.exports('update_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_query('update', invokingResource, query, parameters);
});

global.exports('insert_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_query('insert', invokingResource, query, parameters, cb);
});

global.exports('insert_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_query('insert', invokingResource, query, parameters);
});

global.exports('transaction_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_transaction(invokingResource, query, parameters, cb);
});

global.exports('transaction_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_transaction(invokingResource, query, parameters);
});

global.exports('execute_callback', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  sql_execute(invokingResource, query, parameters, cb);
});

global.exports('execute_async', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return sql_execute(invokingResource, query, parameters);
});
