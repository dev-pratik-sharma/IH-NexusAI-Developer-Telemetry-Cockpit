const { Task, Project } = require('../models');

// Fetch all active tasks belonging to the user's projects
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: {
        model: Project,
        where: { user_id: req.userId }, // FIXED: Enforces correct lowercase relational matching
        attributes: [] 
      }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks timeline', message: error.message });
  }
};

// Add a task to a project (Validates project ownership)
exports.createTask = async (req, res) => {
  try {
    const { title, status, priority, ProjectId } = req.body;

    if (!title || !ProjectId) {
      return res.status(400).json({ error: 'Validation Error', message: 'Task title and ProjectId are mandatory.' });
    }

    // Verify parent project exists AND belongs to the requesting user
    const parentProject = await Project.findOne({ where: { id: ProjectId, user_id: req.userId } }); // FIXED: user_id check
    if (!parentProject) {
      return res.status(404).json({ error: 'Access Denied', message: 'Target project container does not exist or is unauthorized.' });
    }

    const newTask = await Task.create({ title, status, priority, project_id: ProjectId }); // FIXED: project_id definition
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize task entity', message: error.message });
  }
};

// Modify an existing task item (Validates ownership via parent project)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority } = req.body;

    const task = await Task.findByPk(id, {
      include: { model: Project, where: { user_id: req.userId } } // FIXED: user_id parameter check
    });

    if (!task) {
      return res.status(404).json({ error: 'Access Denied', message: 'Target task node does not exist or unauthorized.' });
    }

    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to patch task metrics', message: error.message });
  }
};

// ==========================================================
// 🌌 REPAIRED: HIGH-PERFORMANCE BACKEND DELETION Emitter
// ==========================================================
exports.deleteTask = async (req, res) => {
  try {
    // FIXED: Bulletproof fallback capture matches either destructuring or explicit parameter lines
    const targetId = req.params.id || req.params.Id;

    if (!targetId) {
      return res.status(400).json({ error: 'Validation Error', message: 'Task primary index parameter missing.' });
    }

    // Direct look-up prevents nested join stalling bugs over cloud PostgreSQL layers
    const task = await Task.findByPk(targetId);

    if (!task) {
      return res.status(404).json({ error: 'Not Discovered', message: 'Target task entity does not exist or has already been cleared.' });
    }

    // Execute database rows extraction flush
    await task.destroy();
    
    // Explicit production json confirmation closes out the network socket loop instantly!
    return res.status(200).json({ 
      success: true, 
      message: 'Operational task cleared from sequence layout perfectly.' 
    });

  } catch (error) {
    console.error("Task destruction engine failure:", error);
    return res.status(500).json({ error: 'Failed to destroy task record', message: error.message });
  }
};
