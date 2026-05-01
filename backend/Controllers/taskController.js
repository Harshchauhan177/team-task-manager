const Task = require("../Models/Task");
const Project = require("../Models/Project");

const ALLOWED_PRIORITY = ["Low", "Medium", "High"];
const ALLOWED_STATUS = ["To Do", "In Progress", "Done"];

// Create a new task (Admin only within a project)
const createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, priority, dueDate } = req.body;
    const userId = req.userId;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project ID are required" });
    }

    if (priority && !ALLOWED_PRIORITY.includes(priority)) {
      return res.status(400).json({ message: "Priority must be Low, Medium, or High" });
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

    let assigneeId =
      assignedTo === "" || assignedTo === undefined || assignedTo === null
        ? undefined
        : assignedTo;

    if (assigneeId) {
      const assigneeIsMember = project.members.some(
        (m) => m.user.toString() === assigneeId.toString()
      );
      if (!assigneeIsMember) {
        return res
          .status(400)
          .json({ message: "Assignee must be a member of this project" });
      }
    }

    let parsedDue;
    if (dueDate) {
      parsedDue = new Date(dueDate);
      if (Number.isNaN(parsedDue.getTime())) {
        return res.status(400).json({ message: "Invalid due date" });
      }
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo: assigneeId,
      createdBy: userId,
      priority,
      dueDate: parsedDue,
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

    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );
    const isAdmin = userMember?.role === "Admin";
    const taskQuery = isAdmin
      ? { project: projectId }
      : { project: projectId, assignedTo: userId };

    const tasks = await Task.find(taskQuery)
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

    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );
    const isAdmin = userMember?.role === "Admin";
    const isAssigned =
      task.assignedTo && task.assignedTo._id
        ? task.assignedTo._id.toString() === userId
        : task.assignedTo?.toString() === userId;

    if (!isAdmin && !isAssigned) {
      return res
        .status(403)
        .json({ message: "You can only view tasks assigned to you" });
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

    if (status && !ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (priority && !ALLOWED_PRIORITY.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    // Members can only update status, not other fields
    if (!isAdmin && isAssigned) {
      if (status) task.status = status;
    } else {
      // Admin can update all fields
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (dueDate !== undefined) {
        if (dueDate === "" || dueDate === null) {
          task.dueDate = undefined;
        } else {
          const d = new Date(dueDate);
          if (Number.isNaN(d.getTime())) {
            return res.status(400).json({ message: "Invalid due date" });
          }
          task.dueDate = d;
        }
      }
      if (assignedTo !== undefined) {
        if (assignedTo === "" || assignedTo === null) {
          task.assignedTo = undefined;
        } else {
          const assigneeIsMember = project.members.some(
            (m) => m.user.toString() === assignedTo.toString()
          );
          if (!assigneeIsMember) {
            return res
              .status(400)
              .json({ message: "Assignee must be a member of this project" });
          }
          task.assignedTo = assignedTo;
        }
      }
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

    const memberProjects = await Project.find({
      "members.user": userId,
    }).select("_id");
    const projectIds = memberProjects.map((p) => p._id);

    const tasks = await Task.find({
      assignedTo: userId,
      project: { $in: projectIds },
    })
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
