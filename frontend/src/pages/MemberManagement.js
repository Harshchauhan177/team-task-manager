import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";
import "./MemberManagement.css";

const MemberManagement = ({
  projectId,
  members,
  userRole,
  onMembersUpdate,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [pickFilter, setPickFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!showAddForm || userRole !== "Admin" || !projectId) {
      return undefined;
    }

    const token = localStorage.getItem("token");
    let cancelled = false;

    setListLoading(true);
    setListError("");
    setEligibleUsers([]);
    setSelectedIds([]);
    setPickFilter("");

    api
      .get(`/projects/${projectId}/eligible-members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!cancelled) {
          setEligibleUsers(res.data.users || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setListError(
            err.response?.data?.message || "Could not load user list"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showAddForm, projectId, userRole]);

  const filteredUsers = useMemo(() => {
    const q = pickFilter.trim().toLowerCase();
    if (!q) return eligibleUsers;
    return eligibleUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [eligibleUsers, pickFilter]);

  const selectedSet = useMemo(
    () => new Set(selectedIds.map(String)),
    [selectedIds]
  );

  const toggleUser = (id) => {
    const sid = String(id);
    setSelectedIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredUsers.map((u) => String(u.id));
    setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const clearSelection = () => setSelectedIds([]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedIds.length) {
      setError("Select at least one user (use the checkboxes).");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        `/projects/${projectId}/members`,
        { userIds: selectedIds, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedIds([]);
      setRole("Member");
      setShowAddForm(false);
      setSuccess(res.data?.message || "Members added successfully!");
      setTimeout(() => setSuccess(""), 4000);

      onMembersUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/projects/${projectId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Member removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
      onMembersUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setSelectedIds([]);
    setRole("Member");
    setPickFilter("");
    setListError("");
    setError("");
  };

  return (
    <div className="member-management-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Manage Team Members</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {userRole === "Admin" && (
          <form onSubmit={handleAddMember} className="add-member-form">
            {!showAddForm ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                + Add Member
              </button>
            ) : (
              <div className="form-fields form-fields-add-member">
                <div className="form-group user-picker-block">
                  <label>
                    Select users to add
                    {selectedIds.length > 0 && (
                      <span className="selection-count">
                        {" "}
                        ({selectedIds.length} selected)
                      </span>
                    )}
                  </label>
                  <input
                    type="search"
                    className="user-picker-search"
                    value={pickFilter}
                    onChange={(e) => setPickFilter(e.target.value)}
                    placeholder="Search by name or email…"
                    disabled={loading || listLoading}
                    autoComplete="off"
                  />
                  {!listLoading && !listError && filteredUsers.length > 0 && (
                    <div className="user-picker-toolbar">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={selectAllVisible}
                        disabled={loading}
                      >
                        Select all in list
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={clearSelection}
                        disabled={loading || !selectedIds.length}
                      >
                        Clear selection
                      </button>
                    </div>
                  )}
                  {listLoading && (
                    <p className="user-picker-status">Loading users…</p>
                  )}
                  {!listLoading && listError && (
                    <p className="user-picker-status error">{listError}</p>
                  )}
                  {!listLoading && !listError && eligibleUsers.length === 0 && (
                    <p className="user-picker-status empty-eligible">
                      No users available. Everyone registered is already in this
                      project.
                    </p>
                  )}
                  {!listLoading &&
                    !listError &&
                    eligibleUsers.length > 0 &&
                    filteredUsers.length === 0 && (
                      <p className="user-picker-status empty-eligible">
                        No users match your search.
                      </p>
                    )}
                  {!listLoading && !listError && filteredUsers.length > 0 && (
                    <ul
                      className="user-checkbox-list"
                      aria-label="Users available to add"
                    >
                      {filteredUsers.map((u) => {
                        const idStr = String(u.id);
                        const checked = selectedSet.has(idStr);
                        return (
                          <li key={u.id}>
                            <label
                              className={`user-checkbox-row ${checked ? "is-selected" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleUser(u.id)}
                                disabled={loading}
                              />
                              <span className="user-checkbox-label">
                                <span className="user-checkbox-name">{u.name}</span>
                                <span className="user-checkbox-email">{u.email}</span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="form-group role-field">
                  <label>Role (applies to all selected)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                  >
                    <option>Member</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div className="form-actions form-actions-span">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !selectedIds.length}
                  >
                    {loading
                      ? "Adding…"
                      : selectedIds.length > 1
                        ? `Add ${selectedIds.length} members`
                        : "Add member"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeAddForm}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        <div className="members-list">
          <h3>Current Members ({members?.length})</h3>
          {members?.length > 0 ? (
            <div className="members-table">
              {members.map((member) => (
                <div key={member.user._id} className="member-row">
                  <div className="member-info">
                    <span className="member-name">{member.user.name}</span>
                    <span className="member-email">{member.user.email}</span>
                  </div>

                  <div className="member-role">
                    <span className={`role-badge ${member.role.toLowerCase()}`}>
                      {member.role}
                    </span>
                  </div>

                  {userRole === "Admin" && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveMember(member.user._id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No members yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
