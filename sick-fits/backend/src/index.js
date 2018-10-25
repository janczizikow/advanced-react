require('dotenv').config({ path: '.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO: express middleware to handle cookies
// TODO: express middleware to populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, deeds => {
  console.log(`Server running on http://localhost:${deeds.port}/`)
});