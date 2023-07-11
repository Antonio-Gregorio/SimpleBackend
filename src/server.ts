import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';
import connectDB from './utils/db';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// MongoDB
connectDB();

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});