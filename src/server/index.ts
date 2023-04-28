import express, { type Express, type Request, type Response } from 'express';

// ? Swagger
import swaggerUi from 'swagger-ui-express';

// ? Security
import cors from 'cors';
import helmet from 'helmet';

// ? Router
import rootRouter from '../routes';

//* Create Express App
const app: Express = express();

//* Define SERVER to use "/api" and use rootRouter from 'index.ts' in the routes file
//* from this point on over: http://localhost:8000/api/...
app.use('/api', rootRouter);

//* Swagger Config and Route
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
      explorer: true,
    },
  })
);

//* Static Server
app.use(express.static('public'));

//* Security Config
app.use(helmet());
app.use(cors());

//* Content type Config:
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

//* Redirection Config:
// ? http://localhost:8000/ --> http://localhost:8000/api/
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api');
});

export default app;