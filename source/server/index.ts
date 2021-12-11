import { _query } from './db/query';
import { _execute } from './db/execute';
import { _transaction } from './db/transaction';
import { speedtest } from './db/test';

global.exports('execute', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _query('execute', invokingResource, query, parameters, cb);
});

global.exports('executeSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _query('execute', invokingResource, query, parameters);
});

global.exports('single', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _query('single', invokingResource, query, parameters, cb);
});

global.exports('singleSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _query('single', invokingResource, query, parameters);
});

global.exports('scalar', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _query('scalar', invokingResource, query, parameters, cb);
});

global.exports('scalarSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _query('scalar', invokingResource, query, parameters);
});

global.exports('update', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _query('update', invokingResource, query, parameters, cb);
});

global.exports('updateSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _query('update', invokingResource, query, parameters);
});

global.exports('insert', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _query('insert', invokingResource, query, parameters, cb);
});

global.exports('insertSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _query('insert', invokingResource, query, parameters);
});

global.exports('transaction', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _transaction(invokingResource, query, parameters, cb);
});

global.exports('transactionSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _transaction(invokingResource, query, parameters);
});

global.exports('prepare', (query: string, parameters: any, cb: Function, invokingResource = GetInvokingResource()) => {
  _execute(invokingResource, query, parameters, cb);
});

global.exports('prepareSync', (query: string, parameters: any, invokingResource = GetInvokingResource()) => {
  return _execute(invokingResource, query, parameters);
});

RegisterCommand('sql_speedtest', speedtest, true);
