import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import PageLoading from "../components/PageLoading";
import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- load once on mount

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboard(response.data.dashboard);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageLoading message="Loading your dashboard…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="panel panel--error" role="alert">
          <h2 className="panel__title">Something went wrong</h2>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setLoading(true);
              setError("");
              fetchDashboard();
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-intro">
        <h1>Dashboard</h1>
        <p className="page-intro__sub">
          Hi{user.name ? `, ${user.name}` : ""} — here&apos;s an overview of
          your projects and tasks.
        </p>
      </div>

      <div className="dashboard-stats">
        <article className="stat-card stat-card--projects">
          <span className="stat-card__icon" aria-hidden>
            📁
          </span>
          <h3>Projects</h3>
          <p className="stat-number">{dashboard?.totalProjects || 0}</p>
        </article>

        <article className="stat-card stat-card--tasks">
          <span className="stat-card__icon" aria-hidden>
            📋
          </span>
          <h3>Total tasks</h3>
          <p className="stat-number">{dashboard?.totalTasks || 0}</p>
        </article>

        <article className="stat-card stat-card--mine">
          <span className="stat-card__icon" aria-hidden>
            ✓
          </span>
          <h3>Assigned to you</h3>
          <p className="stat-number">{dashboard?.userAssignedTasks || 0}</p>
        </article>

        <article className="stat-card stat-card--overdue">
          <span className="stat-card__icon" aria-hidden>
            ⚠
          </span>
          <h3>Overdue</h3>
          <p className="stat-number">{dashboard?.overdueTasks?.count || 0}</p>
        </article>
      </div>

      <div className="dashboard-content">
        <section className="panel status-section">
          <h2 className="panel__heading">Tasks by status</h2>
          <p className="panel__hint">Across projects you can access</p>
          <div className="status-breakdown">
            <div className="status-pill status-pill--todo">
              <span className="status-pill__label">To do</span>
              <span className="status-pill__value">
                {dashboard?.tasksByStatus?.["To Do"] || 0}
              </span>
            </div>
            <div className="status-pill status-pill--progress">
              <span className="status-pill__label">In progress</span>
              <span className="status-pill__value">
                {dashboard?.tasksByStatus?.["In Progress"] || 0}
              </span>
            </div>
            <div className="status-pill status-pill--done">
              <span className="status-pill__label">Done</span>
              <span className="status-pill__value">
                {dashboard?.tasksByStatus?.Done || 0}
              </span>
            </div>
          </div>

          <h3 className="panel__subheading">Your assignments</h3>
          <div className="status-breakdown">
            <div className="status-pill status-pill--todo status-pill--compact">
              <span className="status-pill__label">To do</span>
              <span className="status-pill__value">
                {dashboard?.userTasksByStatus?.["To Do"] || 0}
              </span>
            </div>
            <div className="status-pill status-pill--progress status-pill--compact">
              <span className="status-pill__label">In progress</span>
              <span className="status-pill__value">
                {dashboard?.userTasksByStatus?.["In Progress"] || 0}
              </span>
            </div>
            <div className="status-pill status-pill--done status-pill--compact">
              <span className="status-pill__label">Done</span>
              <span className="status-pill__value">
                {dashboard?.userTasksByStatus?.Done || 0}
              </span>
            </div>
          </div>
        </section>

        <section className="panel access-info-section">
          <h2 className="panel__heading">Access & Permissions</h2>
          <p className="panel__hint">Your role across projects</p>
          <div className="access-breakdown">
            <div className="access-card access-card--admin">
              <span className="access-card__icon">👤</span>
              <div className="access-card__content">
                <p className="access-card__label">Admin Access</p>
                <p className="access-card__desc">View and manage all tasks in these projects</p>
              </div>
            </div>
            <div className="access-card access-card--member">
              <span className="access-card__icon">📌</span>
              <div className="access-card__content">
                <p className="access-card__label">Member Access</p>
                <p className="access-card__desc">View only assigned tasks</p>
              </div>
            </div>
          </div>
          <p className="panel__hint" style={{ marginTop: "16px" }}>
            Your task visibility is determined by your role: admins see all project tasks, members see only their assignments.
          </p>
        </section>

        <section className="panel overdue-section">
          <h2 className="panel__heading">Overdue tasks</h2>
          {dashboard?.overdueTasks?.count > 0 ? (
            <>
              <p className="panel__hint">You have {dashboard?.overdueTasks?.count} overdue task{dashboard?.overdueTasks?.count !== 1 ? 's' : ''}</p>
              <ul className="task-list">
                {dashboard?.overdueTasks?.tasks?.map((task) => (
                  <li key={task._id} className="task-item">
                    <div className="task-item__content">
                      <h4>{task.title}</h4>
                      <p className="task-item__project">{task.project?.name}</p>
                      <time className="task-item__due">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </time>
                    </div>
                    <span
                      className={`priority-tag priority-tag--${
                        task.priority?.toLowerCase() || "medium"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty-hint">
              ✓ You&apos;re all caught up — no overdue tasks.
            </p>
          )}
        </section>

        <section className="panel tasks-per-user">
          <h2 className="panel__heading">Tasks per team member</h2>
          {dashboard?.tasksPerUser?.length > 0 ? (
            <>
              <p className="panel__hint">In your accessible projects</p>
              <ul className="user-task-list">
                {dashboard?.tasksPerUser?.map((u) => (
                  <li key={u.userId} className="user-task-item">
                    <span className="user-task-item__name">{u.userName}</span>
                    <span className="task-count-badge">{u.taskCount} task{u.taskCount !== 1 ? 's' : ''}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty-hint">
              No assigned tasks in your projects yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
