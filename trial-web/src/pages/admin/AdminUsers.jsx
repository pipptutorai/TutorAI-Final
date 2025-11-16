import { useState, useEffect } from "react";
import { adminUsersAPI } from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";
import CustomSelect from "../../components/CustomSelect";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [currentPage, roleFilter, statusFilter, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        is_active:
          statusFilter !== "all" ? statusFilter === "active" : undefined,
      };

      const response = await adminUsersAPI.getUsers(params);
      setUsers(response.data.data.users || []);
      setTotalPages(
        Math.ceil((response.data.data.pagination.total || 0) / limit)
      );
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  return (
    <AdminLayout title="User Management">
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by name or email here"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.searchInput}
        />

        <CustomSelect
          value={roleFilter}
          onChange={(val) => {
            setRoleFilter(val);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Roles" },
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
        />

        <CustomSelect
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />

        <button style={styles.refreshButton} onClick={loadUsers}>
          Refresh
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Role</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Joined</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{user.full_name}</td>
                      <td style={styles.tableCell}>{user.email}</td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.badge,
                            background:
                              user.role === "admin" ? "#eaf5f0" : "#f5f5f5",
                            color: user.role === "admin" ? "#153C30" : "#666",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.badge,
                            background: user.is_active ? "#d8f3dc" : "#ffe3e3",
                            color: user.is_active ? "#1b4332" : "#c1121f",
                          }}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>
                        <button style={styles.editButton}>️ Edit</button>
                        <button style={styles.deleteButton}>️ Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

// Inline Styles
const styles = {
  filterContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: "0 1 860px",
    padding: "10px 14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
  },
  refreshButton: {
    padding: "10px 20px",
    background: "#153C30",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  tableHeaderRow: {
    background: "#153C30",
    color: "#fff",
  },
  tableHeader: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
  },
  tableCell: {
    padding: "12px",
    fontSize: "14px",
    color: "#333",
  },
  badge: {
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  editButton: {
    padding: "6px 12px",
    background: "#e0f2e9",
    color: "#153C30",
    border: "1px solid #c8e6c9",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    marginRight: "6px",
  },
  deleteButton: {
    padding: "6px 12px",
    background: "#ffebee",
    color: "#c62828",
    border: "1px solid #ffcdd2",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  errorBox: {
    padding: "15px",
    background: "#fee",
    color: "#c33",
    borderRadius: "6px",
    marginBottom: "20px",
  },
};
