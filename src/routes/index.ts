/**
 ** Root Router
 ** Redirection to Routers
 */
import express from 'express';
// import logger from '../utils/logger';
import cattleRouter from './CattleRouter';
import breedRouter from './BreedRouter';
import rootRouter from './RootRouter';
import cors from 'cors';

// Server Instance
const app = express();

//* Activate for requests to http://localhost:8080/api/

// TODO: Security Settings for URLs
// const whiteList = ['http://localhost:5173'];
// const corsOptions = {
//   origin: whiteList,
//   optionsSuccessStatus: 200,
// };

// const corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
//  }

app.use(cors());

//* GET: http://localhost:8080/api/

//* Redirection to Routers & Controllers
app.use('/', /* cors(corsOptions), */ rootRouter); // ? http://localhost:8080/api/
app.use('/cattle', /* cors(corsOptions), */ cattleRouter); // ? http://localhost:8080/api/cattle
app.use('/breed', /* cors(corsOptions), */ breedRouter); // ? http://localhost:8080/api/breed

//* Add more routes to the server

export default app;
