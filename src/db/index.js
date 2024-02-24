const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const colors = require('colors/safe');
let fs = require('fs');
let path = require('path');
const basePath = `${path.join(__dirname, './../../src/db/schema')}`;
const db = {};

function recursiveModels(folderName = basePath) {
  fs.readdirSync(folderName).forEach((file) => {
    const fullName = path.join(folderName, file);
    const stat = fs.lstatSync(fullName);
    if (stat.isDirectory()) {
      recursiveModels(fullName);
    } else if (file === 'index.js') {
      let x = require(fullName)(sequelize);
      db[x['Schema']] = x;
    }
  });
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DRIVER,
  dialectOptions: {
    requestTimeout: 15000,
  },
  logging: parseInt(process.env.DB_LOGGING) === 1 ? true : false,
  pool: {
    max: parseInt(process.env.DB_POOL_SIZE, 0),
    min: 0,
    acquire: 100000,
    idle: 5000,
    evict: 1000,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
});

recursiveModels(basePath);
Object.keys(db).forEach((schemaName) => {
  Object.keys(db[schemaName]).forEach((modelName) => {
    if (db[schemaName][modelName].associate) {
      db[schemaName][modelName].associate(db);
    }
  });
});

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
    await sequelize.authenticate();
    await db.mongo();
    console.log(`Database connection ${colors.green('OK')}`);
  } catch (e) {
    console.error(`Database connection  ${colors.red('FAILED')}`, e);
    process.exit(1);
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
