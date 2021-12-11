export const typeCast = (field, next) => {
  switch (field.type) {
    case 'DATETIME':
    case 'DATETIME2':
    case 'TIMESTAMP':
    case 'TIMESTAMP2':
    case 'NEWDATE':
    case 'DATE':
      return field.type === 'DATE'
        ? new Date(field.string() + ' 00:00:00').getTime()
        : new Date(field.string()).getTime();
    case 'TINY':
      return field.length === 1 ? field.string() === '1' : next();
    case 'BIT':
      return field.buffer()[0] === 1;
    default:
      return next();
  }
};

export const response = (type: string, result: any) => {
  switch (type) {
    case 'insert':
      return result && result.insertId;

    case 'update':
      return result && result.affectedRows;

    case 'scalar':
      return result && result[0] && Object.values(result[0])[0];

    case 'single':
      return result && result[0];

    default:
      return result;
  }
};

export const preparedTypes = (query) => {
  switch (query.replace(/\s.*/, '')) {
    case 'SELECT':
      return 'execute';
    case 'INSERT':
      return 'insert';
    case 'UPDATE':
      return 'update';
    case 'DELETE':
      return 'update';
    default:
      return false;
  }
};
