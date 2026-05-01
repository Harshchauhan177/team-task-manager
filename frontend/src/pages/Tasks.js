import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import PageLoading from "../components/PageLoading";
import MemberManagement from "./MemberManagement";
import "./Tasks.css";

const Tasks = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState("Member");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
    status: "To Do",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps -- refetch when project changes

  const fetchProjectAndTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const projectRes = await api.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(projectRes.data.project);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userMember = projectRes.data.project.members.find(
        (m) => String(m.user._id) === String(user.id)
      );
      setUserRole(userMember?.role || "Member");

      const tasksRes = await api.get(`/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasksRes.data.tasks);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/tasks",
        { ...formData, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignedTo: "",
        status: "To Do",
      });
      setShowCreateForm(false);
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (e, taskId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload =
      userRole === "Admin"
        ? formData
        : { status: formData.status };

    try {
      await api.put(`/tasks/${taskId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignedTo: "",
        status: "To Do",
      });
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate?.split("T")[0] || "",
      assignedTo: task.assignedTo?._id || "",
      status: task.status,
    });
  };

  const groupTasksByStatus = () => {
    return {
      "To Do": tasks.filter((t) => t.status === "To Do"),
      "In Progress": tasks.filter((t) => t.status === "In Progress"),
      Done: tasks.filter((t) => t.status === "Done"),
    };
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <PageLoading message="Loading project…" />
      </div>
    );
  }

  const tasksByStatus = groupTasksByStatus();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = currentUser?.id;

  return (
    <div className="tasks-page">
      <div className="page-header-row tasks-page__header">
        <div>
          <h1>{project?.name || "Project"}</h1>
          <p className="page-lead">
            {project?.members.length} members · {tasks.length} tasks
            {userRole === "Admin" && (
              <span className="tasks-role-badge"> · You’re an admin</span>
            )}
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="btn btn-secondary"
          >
            All projects
          </button>
          {userRole === "Admin" && (
            <>
              <button
                type="button"
                onClick={() => setShowMemberModal(true)}
                className="btn btn-secondary"
              >
                Members
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="btn btn-primary"
              >
                {showCreateForm ? "Cancel" : "New task"}
              </button>
            </>
          )}
        </div>
      </div>

      {showMemberModal && userRole === "Admin" && (
        <MemberManagement
          projectId={projectId}
          members={project?.members}
          userRole={userRole}
          onMembersUpdate={fetchProjectAndTasks}
          onClose={() => setShowMemberModal(false)}
        />
      )}

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && userRole === "Admin" && (
        <form onSubmit={handleCreateTask} className="create-form">
          <h3>Create New Task</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Assign To</label>
            <select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
            >
              <option value="">-- Select Member --</option>
              {project?.members.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
      )}

      <div className="tasks-board">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="status-column">
            <div className="column-header">
              <h3>{status}</h3>
              <span className="task-count">{statusTasks.length}</span>
            </div>

            <div className="task-list">
              {statusTasks.length > 0 ? (
                statusTasks.map((task) => (
                  <div key={task._id} className="task-card">
                    {editingTask === task._id ? (
                      <form onSubmit={(e) => handleUpdateTask(e, task._id)}>
                        {userRole === "Admin" && (
                          <div className="form-group">
                            <label>Title</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <label>Status</label>
                          <select
                            value={formData.status || status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                          >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                          </select>
                        </div>
                        {userRole === "Admin" && (
                          <>
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                value={formData.description}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    description: e.target.value,
                                  })
                                }
                                rows="2"
                              />
                            </div>
                            <div className="form-group">
                              <label>Priority</label>
                              <select
                                value={formData.priority}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    priority: e.target.value,
                                  })
                                }
                              >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Due Date</label>
                              <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    dueDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Assign To</label>
                              <select
                                value={formData.assignedTo}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    assignedTo: e.target.value,
                                  })
                                }
                              >
                                <option value="">-- Select Member --</option>
                                {project?.members.map((member) => (
                                  <option
                                    key={member.user._id}
                                    value={member.user._id}
                                  >
                                    {member.user.name} ({member.role})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}
                        <div className="form-actions">
                          <button
                            type="submit"
                            className="btn btn-sm btn-primary"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTask(null)}
                            className="btn btn-sm btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="task-header">
                          <h4>{task.title}</h4>
                          <span
                            className={`priority ${task.priority?.toLowerCase()}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}

                        <div className="task-meta">
                          {task.assignedTo && (
                            <div className="assigned-to">
                              <strong>Assigned:</strong> {task.assignedTo.name}
                            </div>
                          )}
                          {task.dueDate && (
                            <div className="due-date">
                              <strong>Due:</strong>{" "}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {(userRole === "Admin" ||
                          String(task.assignedTo?._id) === String(myId)) && (
                          <div className="task-actions">
                            <button
                              onClick={() => handleEditClick(task)}
                              className="btn btn-sm btn-primary"
                            >
                              Edit
                            </button>
                            {userRole === "Admin" && (
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="btn btn-sm btn-danger"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
