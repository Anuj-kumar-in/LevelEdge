import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, isUsingMongo, fallbackDb } from './db';
import { seedData } from './seed';
import salaryRouter from './routes/salaries';
import companyRouter from './routes/companies';
import aiRouter from './routes/ai';
import Salary from './models/Salary';

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? '5000', 10);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/salaries', salaryRouter);
app.use('/api/companies', companyRouter);
app.use('/api/ai/insights', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isUsingMongo ? 'MongoDB' : 'Local JSON Fallback',
    timestamp: new Date().toISOString()
  });
});

// Boot server
async function listenOnConfiguredPort(port: number) {
  await new Promise<void>((resolve) => {
    const server = app.listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`LevelEdge API Server running on: http://localhost:${port}`);
      console.log(`Mode: ${isUsingMongo ? 'MongoDB Direct' : 'Local File Emulation'}`);
      console.log(`======================================================\n`);

      resolve();
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use. Another server process is likely already running there.`);
        console.warn('Keeping the current process alive without starting a duplicate listener.');
        resolve();
        return;
      }

      throw error;
    });
  });
}

async function startServer() {
  // Connect to DB (or fallback to local JSON file)
  await connectDB();

  // Check if we need to auto-seed database
  try {
    let count = 0;
    if (isUsingMongo) {
      count = await Salary.countDocuments({});
    } else {
      count = fallbackDb.getSalaries().length;
    }

    if (count === 0) {
      console.log('Database is empty. Running automatic database seeder...');
      await seedData();
    } else {
      console.log(`Database is already populated with ${count} records. Skipping automatic seeder.`);
    }
  } catch (e: any) {
    console.error('Error during auto-seed check:', e.message);
  }

  // Start Express listener
  await listenOnConfiguredPort(PORT);
}

startServer();
