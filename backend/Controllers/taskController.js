const Task = require("../Models/Task");
const Project = require("../Models/Project");

// Create a new task (Admin only within a project)
const createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, priority, dueDate } = req.body;
    const userId = req.userId;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project ID are required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is Admin in this project
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember || userMember.role !== "Admin") {
      return res.status(403).json({ message: "Only project admins can create tasks" });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: userId,
      priority,
      dueDate,
    });

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all tasks for a project
const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is a member of this project
    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is a member of the project
    const project = await Project.findById(task.project._id);
    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update task (Admin can update any task, Member can update assigned tasks)
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const userId = req.userId;

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project._id);
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only Admin or assigned user can update task
    const isAdmin = userMember.role === "Admin";
    const isAssigned = task.assignedTo?.toString() === userId;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: "Only admins or assigned users can update this task" });
    }

    // Members can only update status, not other fields
    if (!isAdmin && isAssigned) {
      task.status = status || task.status;
    } else {
      // Admin can update all fields
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;
    }

    task.updatedAt = new Date();
    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete task (Admin only)
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project._id);
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember || userMember.role !== "Admin") {
      return res.status(403).json({ message: "Only project admins can delete tasks" });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's assigned tasks
const getUserAssignedTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ assignedTo: userId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name")
      .sort({ dueDate: 1 });

    res.status(200).json({
      message: "Assigned tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserAssignedTasks,
};
