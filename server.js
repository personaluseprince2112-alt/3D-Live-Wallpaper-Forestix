const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

console.log(DB);

mongoose.connect(DB).then(() => {
  console.log('DB Connection Successful!');
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
