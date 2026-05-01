const Task = require("../Models/Task");
const Project = require("../Models/Project");

/** Tasks a user may see: all tasks in projects where they are Admin or Creator; only assigned tasks where they are Member. */
function buildVisibleTaskFilterForUser(projects, userId) {
  const adminProjectIds = [];
  const memberOnlyProjectIds = [];

  for (const p of projects) {
    // Creators can see all tasks (treat as admin)
    if (p.creator.toString() === userId) {
      adminProjectIds.push(p._id);
      continue;
    }
    
    const member = p.members.find((m) => m.user.toString() === userId);
    if (!member) continue;
    if (member.role === "Admin") adminProjectIds.push(p._id);
    else memberOnlyProjectIds.push(p._id);
  }

  const orConditions = [];
  if (adminProjectIds.length) {
    orConditions.push({ project: { $in: adminProjectIds } });
  }
  if (memberOnlyProjectIds.length) {
    orConditions.push({
      project: { $in: memberOnlyProjectIds },
      assignedTo: userId,
    });
  }

  if (!orConditions.length) {
    return { _id: { $exists: false } };
  }
  return { $or: orConditions };
}

// Get dashboard statistics
const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all projects where user is a member OR is the creator
    const projects = await Project.find({
      $or: [
        { "members.user": userId },
        { creator: userId }
      ]
    });

    const visibleTaskFilter = buildVisibleTaskFilterForUser(projects, userId);

    // Total tasks (only tasks this user is allowed to see)
    const totalTasks = await Task.countDocuments(visibleTaskFilter);

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $match: visibleTaskFilter,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format tasks by status
    const statusCount = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0,
    };

    tasksByStatus.forEach((item) => {
      statusCount[item._id] = item.count;
    });

    // Overdue tasks
    const now = new Date();
    const overdueTasks = await Task.find({
      ...visibleTaskFilter,
      dueDate: { $lt: now },
      status: { $ne: "Done" },
    })
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .sort({ dueDate: 1 });

    // Tasks per user in assigned projects
    const tasksPerUser = await Task.aggregate([
      {
        $match: {
          ...visibleTaskFilter,
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$user.name",
          userEmail: "$user.email",
          taskCount: "$count",
        },
      },
    ]);

    // User's assigned tasks - get project IDs where user can see tasks
    const projectIds = projects.map(p => p._id);
    const userAssignedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      assignedTo: userId,
    });

    // User's assigned tasks by status
    const userTasksByStatus = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const userStatusCount = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0,
    };

    userTasksByStatus.forEach((item) => {
      userStatusCount[item._id] = item.count;
    });

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      dashboard: {
        totalProjects: projects.length,
        totalTasks,
        tasksByStatus: statusCount,
        overdueTasks: {
          count: overdueTasks.length,
          tasks: overdueTasks,
        },
        tasksPerUser,
        userAssignedTasks,
        userTasksByStatus: userStatusCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get project-specific dashboard
const getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is a member or creator
    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );
    const isCreator = project.creator.toString() === userId;

    if (!isMember && !isCreator) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );
    const isAdmin = isCreator || userMember?.role === "Admin";
    const projectTaskFilter = isAdmin
      ? { project: projectId }
      : { project: projectId, assignedTo: userId };

    // Total tasks in project (members: only assigned)
    const totalTasks = await Task.countDocuments(projectTaskFilter);

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $match: projectTaskFilter,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCount = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0,
    };

    tasksByStatus.forEach((item) => {
      statusCount[item._id] = item.count;
    });

    // Overdue tasks
    const now = new Date();
    const overdueTasks = await Task.find({
      ...projectTaskFilter,
      dueDate: { $lt: now },
      status: { $ne: "Done" },
    })
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1 });

    // Tasks per user
    const tasksPerUser = await Task.aggregate([
      {
        $match: {
          ...projectTaskFilter,
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$user.name",
          userEmail: "$user.email",
          taskCount: "$count",
        },
      },
    ]);

    res.status(200).json({
      message: "Project dashboard data retrieved successfully",
      dashboard: {
        projectName: project.name,
        totalMembers: project.members.length,
        totalTasks,
        tasksByStatus: statusCount,
        overdueTasks: {
          count: overdueTasks.length,
          tasks: overdueTasks,
        },
        tasksPerUser,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboard,
  getProjectDashboard,
};
