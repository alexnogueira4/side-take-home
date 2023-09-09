import express, { urlencoded } from 'express';
import 'express-async-errors';
import { propertyRoutes } from './routes';
import cors from 'cors';
import { ErrorHandler, NotFoundHandler } from './helpers';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';

const app = express();
app.use(helmet())
  .use(bodyParser.json())
  .use(compression())
  .use(urlencoded({ extended: true }))
  .use(cors())
  .options('*', cors());

app.use('/properties', propertyRoutes);

app.use(ErrorHandler);
app.use(NotFoundHandler);
export default app;
