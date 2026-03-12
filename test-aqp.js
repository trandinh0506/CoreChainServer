const aqp = require('api-query-params');
const query = 'status=active&age>20&name=/john/i&sort=-createdAt&limit=5&skip=2';
const parsed = aqp(query);
console.log(JSON.stringify(parsed, null, 2));
console.log('Regex type check:', parsed.filter.name instanceof RegExp);
