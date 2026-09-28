const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/house_rent';
    
    // Attempt standard connection first
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to check local/remote URI
    });
    
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to primary URI (${process.env.MONGO_URI || 'localhost:27017'}): ${error.message}`);
    
    // If standard connection fails, start In-Memory MongoDB Server so the app runs standalone without external setup
    try {
      console.log('[MongoDB] Launching In-Memory MongoDB Server for standalone local development/demo...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 120000, // 2 minutes timeout for Windows binary extraction
        },
      });
      const inMemoryUri = mongodInstance.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] In-Memory MongoDB connected successfully at ${inMemoryUri}`);
      console.log('[MongoDB] NOTE: Using in-memory database. Data is automatically initialized for demonstration.');
      
      // Auto-seed in-memory database
      const { seedDatabase } = require('../utils/seed');
      await seedDatabase();
    } catch (memError) {
      console.error(`[MongoDB] In-Memory MongoDB failed to start: ${memError.message}`);
      console.error('[MongoDB] Please ensure MongoDB is running locally or set MONGO_URI in server/.env with a valid MongoDB Atlas connection string.');
      // Do not crash server so endpoints still respond with descriptive database guidance
    }
  }
};

module.exports = connectDB;
