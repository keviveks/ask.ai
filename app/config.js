const dotenv = require('dotenv');
const fs = require('fs');

// check for .env file
if (!fs.existsSync('.env')) {
  console.log('Environment file not found!!');
  process.exit(1);
}

/**
 * Load the config parameters from .env file
 */
dotenv.config();

module.exports = {
  port: process.env.PORT,
  auth: {
    admin: process.env.AUTH_PASSWORD,
  },
  aiProjectId: process.env.AI_PROJECT_ID,
  db: {
    uri: `${process.env.MONGO_URI}/${process.env.MONGO_NAME}`,
    options: {
      keepAlive: 1,
      useNewUrlParser: true,
    },
  },
};
