import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import mediaRoutes from './routes/mediaRoutes.js';
import { validateEnv } from './types/environment.js';
import { errorHandler, notFound } from './middleware/auth.js';

dotenv.config();
validateEnv();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use('/api', mediaRoutes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Mongo connection failed:', err);
    process.exit(1);
  });
