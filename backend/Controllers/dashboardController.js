const Task = require("../Models/Task");
const Project = require("../Models/Project");

// Get dashboard statistics
const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all projects for the user
    const projects = await Project.find({
      "members.user": userId,
    });

    const projectIds = projects.map((p) => p._id);

    // Total tasks
    const totalTasks = await Task.countDocuments({
      project: { $in: projectIds },
    });

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
        },
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
      project: { $in: projectIds },
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
          project: { $in: projectIds },
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

    // User's assigned tasks
    const userAssignedTasks = await Task.countDocuments({
      assignedTo: userId,
      project: { $in: projectIds },
    });

    // User's assigned tasks by status
    const userTasksByStatus = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
          project: { $in: projectIds },
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

    // Check if user is a member
    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Total tasks in project
    const totalTasks = await Task.countDocuments({ project: projectId });

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $match: {
          project: projectId,
        },
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
      project: projectId,
      dueDate: { $lt: now },
      status: { $ne: "Done" },
    })
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1 });

    // Tasks per user
    const tasksPerUser = await Task.aggregate([
      {
        $match: {
          project: projectId,
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
