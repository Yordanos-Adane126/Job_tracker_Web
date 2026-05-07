import React, { useMemo, useState } from "react";
import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [applications, setApplications] = useState([]);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    date: "",
    status: "Applied",
    notes: "",
  });

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const progress =
    totalApplications === 0
      ? 0
      : Math.round(((interviews + offers) / totalApplications) * 100);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingIndex(null);

    setFormData({
      company: "",
      role: "",
      date: "",
      status: "Applied",
      notes: "",
    });

    setShowModal(true);
  };

  const addOrUpdateApplication = () => {
    if (!formData.company || !formData.role) {
      alert("Please fill all required fields");
      return;
    }

    if (editingIndex !== null) {
      const updatedApplications = [...applications];

      updatedApplications[editingIndex] = formData;

      setApplications(updatedApplications);
    } else {
      setApplications([...applications, formData]);
    }

    setFormData({
      company: "",
      role: "",
      date: "",
      status: "Applied",
      notes: "",
    });

    setEditingIndex(null);
    setShowModal(false);
  };

  const deleteApplication = (index) => {
    const updatedApplications = applications.filter(
      (_, i) => i !== index
    );

    setApplications(updatedApplications);
  };

  const editApplication = (index) => {
    setEditingIndex(index);

    setFormData(applications[index]);

    setShowModal(true);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesFilter =
        activeFilter === "All" || app.status === activeFilter;

      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [applications, activeFilter, searchTerm]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Interview":
        return "interview-status";
      case "Offer":
        return "offer-status";
      case "Rejected":
        return "rejected-status";
      default:
        return "applied-status";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Interview":
        return "dot-orange";
      case "Offer":
        return "dot-green";
      case "Rejected":
        return "dot-red";
      default:
        return "dot-blue";
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="logo">👜</div>

        <div>
          <h1>Job Application Tracker</h1>
          <p>Track your job search journey</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="card">
          <div className="icon blue">👜</div>

          <div>
            <h2>{totalApplications}</h2>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="card">
          <div className="icon orange">📅</div>

          <div>
            <h2>{interviews}</h2>
            <p>Interviews</p>
          </div>
        </div>

        <div className="card">
          <div className="icon green">🏆</div>

          <div>
            <h2>{offers}</h2>
            <p>Offers</p>
          </div>
        </div>

        <div className="card">
          <div className="icon red">❌</div>

          <div>
            <h2>{rejected}</h2>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-box">
        <div className="progress-header">
          <h3>Progress Rate</h3>

          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p>Applications progressing to interview or offer stage</p>
      </div>

      {/* Search + Filters */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search company or role..."
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filters">
          {["All", "Applied", "Interview", "Offer", "Rejected"].map(
            (filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            )
          )}

          <button className="add-btn" onClick={openAddModal}>
            + Add
          </button>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="big-plus">+</div>

          <h2>No applications yet</h2>

          <p>
            Start tracking your job search journey by adding your first
            application.
          </p>

          <button onClick={openAddModal}>
            + Add Your First Application
          </button>
        </div>
      ) : (
        <div className="applications">
          {filteredApplications.map((app, index) => (
            <div className="application-card" key={index}>
              <div className="card-top">
                <div className={`status-badge ${getStatusClass(app.status)}`}>
                  <span
                    className={`status-dot ${getStatusDot(app.status)}`}
                  ></span>

                  {app.status}
                </div>

                <div className="card-actions">
                  <button
                    className="icon-btn"
                    onClick={() => editApplication(index)}
                  >
                    ✏️
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    onClick={() => deleteApplication(index)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="job-role">{app.role}</h3>

              <div className="company-row">
                <span>🏢</span>

                <p>{app.company}</p>
              </div>

              <div className="date-row">
                <span>📅</span>

                <p>
                  Applied{" "}
                  {app.date
                    ? new Date(app.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No date"}
                </p>
              </div>

              {app.notes && (
                <>
                  <div className="card-divider"></div>

                  <div className="notes-row">
                    <span>📝</span>

                    <p>{app.notes}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingIndex !== null
                  ? "Edit Application"
                  : "Add New Application"}
              </h2>

              <span
                className="close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </span>
            </div>

            <div className="form-grid">
              <div>
                <label>Company</label>

                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Role</label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Software Engineer"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Date Applied</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="notes-section">
              <label>Notes</label>

              <textarea
                name="notes"
                placeholder="Add interview notes, contact info, or other details..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="submit-btn"
                onClick={addOrUpdateApplication}
              >
                {editingIndex !== null
                  ? "Update Application"
                  : "Add Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;