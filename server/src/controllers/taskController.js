const { Task, Project } = require('../models');

// Fetch all active tasks belonging to the user's projects
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: {
        model: Project,
        where: { user_id: req.userId }, 
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

    const parentProject = await Project.findOne({ where: { id: ProjectId, user_id: req.userId } }); 
    if (!parentProject) {
      return res.status(404).json({ error: 'Access Denied', message: 'Target project container does not exist or is unauthorized.' });
    }

    const newTask = await Task.create({ title, status, priority, project_id: ProjectId, ProjectId: ProjectId }); 
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

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: 'Target task node does not exist.' });
    }

    // Double check project ownership separately to avoid inner-join failures
    const targetProjId = task.project_id || task.ProjectId;
    const project = await Project.findOne({ where: { id: targetProjId, user_id: req.userId } });
    if (!project) {
      return res.status(401).json({ error: 'Access Denied', message: 'Unauthorized task modification.' });
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

// =================================================================
// 🌌 REPAIRED & BULLETPROOFED: BULK STABLE TASK PURGER EXECUTOR
// =================================================================
exports.deleteTask = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (!targetId) {
      return res.status(400).json({ error: 'Validation Error', message: 'Task unique identifier parameter missing.' });
    }

    // Step 1: Locate the target task row directly first
    const task = await Task.findByPk(targetId);

    if (!task) {
      return res.status(404).json({ error: 'Not Discovered', message: 'Task record does not exist or has already been cleared.' });
    }

    // Step 2: Extract project references safely to check ownership without failing on join structures
    const associatedProjectId = task.project_id || task.ProjectId;
    
    if (associatedProjectId) {
      const parentProjectOwnershipCheck = await Project.findOne({
        where: { id: associatedProjectId, user_id: req.userId }
      });

      // If the project doesn't belong to the logged-in user, block deletion
      if (!parentProjectOwnershipCheck) {
        return res.status(403).json({ error: 'Access Denied', message: 'Clearance verification failure: Unauthorized resource access.' });
      }
    }

    // Step 3: All checks pass safely -> execute permanent record destruction
    await task.destroy();
    
    // Express returns explicit JSON success message instantly, releasing frontend loaders
    return res.status(200).json({ 
      success: true, 
      message: 'Operational task cleared from sequence layout perfectly.' 
    });

  } catch (error) {
    console.error("Critical Task destruction engine failure:", error);
    return res.status(500).json({ error: 'Failed to destroy task record', message: error.message });
  }
};
