import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import taskRoutes from './routes/taskRoute.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// connect database
connectDB(); 

const app = express();

app.use(express.json());
app.use(cors());

// Use the PORT from the .env file, fallback to 3000 if not defined
const port = process.env.PORT || 5000;

// Corrected route
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the simple server!');
});

app.post('/test', (req, res) => {
    console.log('Test route hit');
    res.send('Test route working');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgRed.white);
});
