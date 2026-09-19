const express = require('express');
const cors = require('cors');
const { sequelize, Project, Task } = require('./models');

// Import Modular Routers
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes'); 
const aiRoutes = require('./routes/aiRoutes'); // NEW: Secured Gemini AI Route Module

// Import Security Middleware Interceptor
const auth = require('./middleware/auth');

// Import Centralized Error Middleware
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware Configuration
app.use(cors());
app.use(express.json());

// API Module Endpoint Interlocking
app.use('/api/auth', userRoutes);                        // Public Access Gateway (Login / Signup)
app.use('/api/projects', auth, projectRoutes);            // SECURED: Requires Bearer JWT Clearance Token
app.use('/api/tasks', auth, taskRoutes);                  // SECURED: Requires Bearer JWT Clearance Token
app.use('/api/ai', aiRoutes);                             // NEW SECURED AI ENDPOINT: Connects to Gemini Engine

// Baseline System Diagnostics Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "ONLINE",
    message: "Nexus Core Sequelize API Server executing cleanly.",
    timestamp: new Date().toISOString()
  });
});

// Central Error Interceptor must stay beneath router parameters
app.use(errorHandler);

// Automatic Seeding check updated to prevent unassigned orphan rows
const seedDatabase = async () => {
  try {
    const projectCount = await Project.count();
    if (projectCount === 0) {
      console.log('🌱 Database is empty. Creating baseline layout references...');
      
      // Global seed elements are instantiated cleanly with no strict owner constraints on boot
      const p1 = await Project.create({ name: 'Quantum Core API', category: 'Backend', progress: 75, UserId: null });
      const p2 = await Project.create({ name: 'Nova Nebula UI Suite', category: 'Frontend', progress: 40, UserId: null });
      const p3 = await Project.create({ name: 'Aether Crypt Engine', category: 'Security', progress: 100, UserId: null });

      await Task.create({ title: 'Optimize PostgreSQL execution indexes', status: 'in-progress', priority: 'High', ProjectId: p1.id });
      await Task.create({ title: 'Design responsive layout for glass dashboard components', status: 'completed', priority: 'Medium', ProjectId: p2.id });
      await Task.create({ title: 'Integrate OpenAI token sequence streaming routes', status: 'todo', priority: 'High', ProjectId: p1.id });
      await Task.create({ title: 'Audit JSON Web Token cryptographic signatures', status: 'completed', priority: 'High', ProjectId: p3.id });
      await Task.create({ title: 'Re-engineer CSS hardware-acceleration layer blurs', status: 'todo', priority: 'Low', ProjectId: p2.id });
      console.log('✅ Baseline portfolio reference elements cached successfully.');
    } else {
      console.log('📊 Active rows detected inside PostgreSQL. Skipping seeder routines.');
    }
  } catch (error) {
    console.error('❌ Failed to execute database seeding sequence:', error.message);
  }
};

// Sync Database Schemas and Boot Application Listener Node
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('⚡ Cloud PostgreSQL Models Synced Perfectly via Sequelize ORM!');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log('🚀 Nexus Server executing on network cluster port http://localhost:' + PORT);
    });
  })
  .catch(err => {
    console.error('❌ Database Initialization and Synchronization Failed:', err.message);
  });
