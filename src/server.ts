import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { routes } from './routes/routes.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  })
);

app.use(routes);

app.listen(3333, () => {
  console.log('Server is running on port 3333');
});

export default app;
