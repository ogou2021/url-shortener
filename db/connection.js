const monk = require('monk');
const connectionURL = process.env.MONGODB_URI || 'localhost/ogou-ga';
const db = monk(connectionURL);

module.exports = db;