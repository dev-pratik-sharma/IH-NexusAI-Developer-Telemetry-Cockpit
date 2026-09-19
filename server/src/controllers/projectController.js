const { Project, Task } = require('../models');

// Fetch projects belonging ONLY to the authenticated user
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ 
      where: { user_id: req.userId }, // FIXED: Changed UserId to match exact user_id schema configuration
      include: Task 
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects', message: error.message });
  }
};

// Create a new project linked directly to the active user
exports.createProject = async (req, res) => {
  try {
    const { name, category, progress } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Validation Error', message: 'Project name and category are required.' });
    }

    const newProject = await Project.create({ 
      name, 
      category, 
      progress,
      user_id: req.userId // FIXED: Matches explicit user_id field configurations
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to build project instance', message: error.message });
  }
};

// Delete a project (Verifies ownership first)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.destroy({ 
      where: { id, user_id: req.userId } // FIXED: Aligned search parameters
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Clearance Conflict', message: 'Target project node does not exist or unauthorized access.' });
    }
    
    res.status(200).json({ message: 'Project suite removed perfectly.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to destroy project instance', message: error.message });
  }
};
