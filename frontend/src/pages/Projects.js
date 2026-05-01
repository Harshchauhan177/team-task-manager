import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import PageLoading from "../components/PageLoading";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- load once on mount

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(response.data.projects);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.post("/projects", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="projects-page">
        <PageLoading message="Loading projects…" />
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header-row">
        <div>
          <h1>Projects</h1>
          <p className="page-lead">
            Create teams, add members, and organize work in one place.
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? "Cancel" : "New project"}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form onSubmit={handleCreateProject} className="create-form">
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      )}

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => {
            const myMembership = project.members.find(
              (m) => String(m.user._id) === String(currentUser.id)
            );
            const isProjectAdmin = myMembership?.role === "Admin";

            return (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h2>{project.name}</h2>
                <span className="member-count">
                  {project.members.length} members
                  {myMembership && (
                    <span className="your-role">
                      {" "}
                      · You: {myMembership.role}
                    </span>
                  )}
                </span>
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-members">
                <h4>Members:</h4>
                <div className="members-list">
                  {project.members.slice(0, 3).map((member) => (
                    <span
                      key={member.user._id}
                      className={`member ${member.role.toLowerCase()}`}
                    >
                      {member.user.name}
                    </span>
                  ))}
                  {project.members.length > 3 && (
                    <span className="more-members">
                      +{project.members.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="project-actions">
                <button
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="btn btn-sm btn-primary"
                >
                  View Tasks
                </button>
                {isProjectAdmin && (
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            );
          })
        ) : (
          <div className="no-projects">
            <p>No projects yet. Create your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
