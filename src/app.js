import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

const app = express();

const corsOptions = {
    origin: env.corsOrigins.length ? env.corsOrigins : true,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1', apiRouter);

app.use(notFound);
app.use(errorHandler);
export { app };


