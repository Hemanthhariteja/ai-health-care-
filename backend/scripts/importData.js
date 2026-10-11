#!/usr/bin/env node

/**
 * Data Import Script
 * 
 * Usage:
 * npm run import-data -- --file path/to/file.csv
 * 
 * This script imports healthcare data from a CSV file into MongoDB
 */

require('dotenv').config();
const connectDatabase = require('../config/database');
const HealthcareDataService = require('../services/healthcareDataService');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let filePath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) {
    filePath = args[i + 1];
  }
}

if (!filePath && args.length === 1) {
  filePath = args[0];
}

if (!filePath) {
  console.error('❌ Error: Please provide a file path');
  console.error('Usage: npm run import-data -- --file path/to/file.csv');
  process.exit(1);
}

const absolutePath = path.resolve(filePath);

console.log(`
╔════════════════════════════════════════════╗
║   Healthcare Data Import Script            ║
╚════════════════════════════════════════════╝
`);

console.log(`📄 File: ${absolutePath}`);

// Connect to database and import data
connectDatabase().then(async () => {
  try {
    console.log('🔄 Importing healthcare data...');
    const result = await HealthcareDataService.importFromCSV(absolutePath);

    console.log(`
✅ Import Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message: ${result.message}
Records: ${result.count}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The healthcare data is now integrated with your chatbot!

Available endpoints:
- GET  /api/healthcare-data/search?condition=diabetes
- GET  /api/healthcare-data/patient/:name
- GET  /api/healthcare-data/stats/:condition
- GET  /api/healthcare-data/insights
- GET  /api/healthcare-data/database-stats
- POST /api/healthcare-data/import (for new CSV files)

Chat endpoints now enhanced with healthcare data:
- POST /api/chat/send (automatically uses healthcare context)
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}).catch((error) => {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
});
