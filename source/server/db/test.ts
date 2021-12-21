import { scheduleTick } from '../utils';
import pool from './pool';

const _query = async (query: string, parameters?: Object) => {
  scheduleTick();
  try {
    return (await pool.query(query, parameters)) as any;
  } catch (err) {
    throw new Error(err);
  }
};

RegisterCommand('sql_speedtest', async () => {
    const val = 10000;
    const queryTimesLocal = [];
    let result;
    for (let i = 0; i < val; i++) {
      const [rows, fields, time] = await _query('SELECT is_dead FROM users WHERE lastname = ? OR lastname = ? LIMIT 1', [null, 'Linden']);
      if (i === 0) result = rows;
      queryTimesLocal.push(time);
    }
    const queryMsSum = queryTimesLocal.reduce((a, b) => a + b, 0);
    const queryMsHigh = queryTimesLocal.sort((a, b) => b - a)[0];
    const queryMsLow = queryTimesLocal.sort((a, b) => a - b)[0];
    const averageQueryTime = queryMsSum / queryTimesLocal.length;
    console.log(result);
    console.log(
      'Low: ' +
        queryMsLow +
        'ms | High: ' +
        queryMsHigh +
        'ms | Avg: ' +
        averageQueryTime +
        'ms | Total: ' +
        queryMsSum +
        'ms (' +
        queryTimesLocal.length +
        ' queries)'
    );
  },
  true
);
