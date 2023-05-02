import morgan from 'morgan';
import config from 'config';
import dotenv from 'dotenv';
import app from './src/server';
import logger from './src/utils/logger';

//* Configuration the .env file
dotenv.config();

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

if (config.get('jwtPrivateKey') === undefined) {
  logger('jwtPrivateKey is not defined', 'fatal', 'app');
  process.exit(1);
}

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  logger(`[SERVER ON]: Listening on port ${port}`, 'trace', 'app');
});

// const port = process.env.PORT ?? 5000;

//* Execute SERVER

// app.listen(port, () => {
//   logger(`[SERVER ON]: Running in http://localhost:${port}/api`, 'info', 'app');
// });

//* Control SERVER ERROR
app.on('error', error => {
  logger(error, 'info', 'app');
});
