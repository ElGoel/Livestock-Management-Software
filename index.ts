import dotenv from 'dotenv';
import app from './src/server';
import logger from './src/utils/logger';

//* Configuration the .env file
dotenv.config();

const port = process.env.PORT ?? 5000;

//* Execute SERVER

app.listen(port, () => {
  logger(`[SERVER ON]: Running in http://localhost:${port}/api`, 'info', 'app');
});

//* Control SERVER ERROR
app.on('error', error => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger(`[SERVER ERROR]: ${error}`, 'info', 'app');
});
