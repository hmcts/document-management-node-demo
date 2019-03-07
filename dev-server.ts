
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = require('./application');
app.listen(3001, () => console.log('Example app listening on port 3001!'));
