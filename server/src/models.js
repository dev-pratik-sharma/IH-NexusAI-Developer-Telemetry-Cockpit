const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// 1. User Model Definition
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'email' },
  password: { type: DataTypes.STRING, allowNull: false, field: 'password' }
}, {
  tableName: 'users'
});

// 2. Project Model Definition
const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
  category: { type: DataTypes.STRING, allowNull: false, field: 'category' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0, field: 'progress' }
}, {
  tableName: 'projects'
});

// 3. Task Model Definition
const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false, field: 'title' },
  status: { type: DataTypes.STRING, defaultValue: 'todo', field: 'status' }, 
  priority: { type: DataTypes.STRING, defaultValue: 'Medium', field: 'priority' } 
}, {
  tableName: 'tasks'
});

// 4. Establish Relational Model Associations
User.hasMany(Project, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = { sequelize, User, Project, Task };
