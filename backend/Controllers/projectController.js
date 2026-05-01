const Project = require("../Models/Project");
const User = require("../Models/User");

// Create a new project (creator becomes Admin)
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = new Project({
      name,
      description,
      creator: userId,
      members: [
        {
          user: userId,
          role: "Admin",
        },
      ],
    });

    await project.save();
    await project.populate("creator", "name email");
    await project.populate("members.user", "name email");

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all projects for a user
const getUserProjects = async (req, res) => {
  try {
    const userId = req.userId;

    const projects = await Project.find({
      "members.user": userId,
    })
      .populate("creator", "name email")
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId)
      .populate("creator", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is a member of this project
    const isMember = project.members.some(
      (member) => member.user._id.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update project (Admin only)
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is Admin
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember || userMember.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can update project" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.updatedAt = new Date();

    await project.save();
    await project.populate("creator", "name email");
    await project.populate("members.user", "name email");

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete project (Admin only)
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is Admin
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember || userMember.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete project" });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add member to project (Admin only)
const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const userId = req.userId;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is Admin
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember || userMember.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can add members" });
    }

    // Find user by email
    const newMember = await User.findOne({ email });

    if (!newMember) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if member already exists
    const alreadyMember = project.members.some(
      (member) => member.user.toString() === newMember._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push({
      user: newMember._id,
      role: role || "Member",
    });

    await project.save();
    await project.populate("members.user", "name email");

    res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove member from project (Admin only)
const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is Admin
    const userMember = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!userMember || userMember.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can remove members" });
    }

    // Prevent removing the creator
    if (project.creator.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove project creator" });
    }

    project.members = project.members.filter(
      (member) => member.user.toString() !== memberId
    );

    await project.save();
    await project.populate("members.user", "name email");

    res.status(200).json({
      message: "Member removed successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
