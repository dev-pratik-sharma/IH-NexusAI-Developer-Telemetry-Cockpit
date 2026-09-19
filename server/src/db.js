const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize the Sequelize instance using your Singapore database connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Prevents console spam with raw SQL commands during requests
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Imperative layer for hosted cloud clusters (Neon/Supabase)
    }
  }
});

module.exports = sequelize;
