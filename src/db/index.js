const colors = require('colors/safe');
const db = {};
const mongoose = require('mongoose');

db.mongo = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    return connection;
  } catch (e) {
    process.exit(1);
  }
};

db.ping = async () => {
  try {
    await db.mongo();
    console.log(`Database connection ${colors.green('OK')}`);
  } catch (e) {
    console.error(`Database connection  ${colors.red('FAILED')}`, e);
    process.exit(1);
  }
};

module.exports = db;
