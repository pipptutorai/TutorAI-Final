import { useState, useEffect } from "react";
import { adminChatsAPI } from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedChat, setSelectedChat] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const [stats, setStats] = useState({
    totalChats: 0,
    indonesian: 0,
    english: 0,
  });

  useEffect(() => {
    loadChats();
  }, [currentPage, searchTerm, userFilter, dateFrom, dateTo]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        user: userFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const response = await adminChatsAPI.getChats(params);
      setChats(response.data.data.chats || []);
      setTotalPages(
        Math.ceil((response.data.data.pagination.total || 0) / limit)
      );

      const total = response.data.data.pagination.total || 0;
      const chatList = response.data.data.chats || [];
      const indonesian = chatList.filter(
        (c) => c.language === "id" || c.language === "indonesian"
      ).length;
      const english = chatList.filter(
        (c) => c.language === "en" || c.language === "english"
      ).length;

      setStats({ totalChats: total, indonesian, english });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load chats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (chat) => {
    try {
      const response = await adminChatsAPI.getChat(chat.id);
      setSelectedChat(response.data.data.chat);
      setShowDetailModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load chat details");
    }
  };

  const handleDeleteChat = async () => {
    try {
      await adminChatsAPI.deleteChat(chatToDelete.id);
      setShowDeleteModal(false);
      setChatToDelete(null);
      loadChats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete chat");
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = {
        search: searchTerm || undefined,
        user: userFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const response = await adminChatsAPI.exportChats(params);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `chats-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("Chats exported successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to export chats");
    }
  };

  const openDeleteModal = (chat) => {
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <AdminLayout title="Chat Monitoring">
      {/* Floating Background */}
      <div style={floatingBackgroundStyle}></div>

      {/* Statistics */}
      <div style={statsGrid}>
        <div style={{ ...statCardStyle, borderTop: "4px solid #153C30" }}>
          <div style={cardLabel}>Total Chats</div>
          <div style={cardValue}>{stats.totalChats}</div>
        </div>
        <div style={{ ...statCardStyle, borderTop: "4px solid #2D7A5F" }}>
          <div style={cardLabel}>Indonesian</div>
          <div style={cardValue}>{stats.indonesian}</div>
        </div>
        <div style={{ ...statCardStyle, borderTop: "4px solid #94A3B8" }}>
          <div style={cardLabel}>English</div>
          <div style={cardValue}>{stats.english}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={filterBar}>
        <input
          type="text"
          placeholder="🔍 Search messages..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="📧 Filter by user email..."
          value={userFilter}
          onChange={(e) => {
            setUserFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={inputStyle}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setCurrentPage(1);
          }}
          style={inputStyle}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setCurrentPage(1);
          }}
          style={inputStyle}
        />
        <button onClick={loadChats} style={buttonPrimary}>
          Refresh
        </button>
        <button onClick={handleExportCSV} style={buttonSecondary}>
          Export CSV
        </button>
      </div>

      {/* Error Message */}
      {error && <div style={errorBox}>{error}</div>}

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
          Loading chats...
        </div>
      ) : (
        <>
          {/* Table */}
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#F8FAFB" }}>
                  <th style={tableHeaderStyle}>User</th>
                  <th style={tableHeaderStyle}>Message</th>
                  <th style={tableHeaderStyle}>Language</th>
                  <th style={tableHeaderStyle}>Timestamp</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!chats || chats.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                      No chats found
                    </td>
                  </tr>
                ) : (
                  chats.map((chat) => (
                    <tr key={chat.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <td style={tableCellStyle}>
                        <div style={{ fontWeight: 600, color: "#1E293B" }}>
                          {chat.user_name || "Unknown"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748B" }}>
                          {chat.user_email}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        {truncateText(chat.user_message)}
                      </td>
                      <td style={tableCellStyle}>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            background:
                              chat.language === "id"
                                ? "rgba(21, 60, 48, 0.08)"
                                : "rgba(45, 122, 95, 0.08)",
                            color:
                              chat.language === "id"
                                ? "#153C30"
                                : "#2D7A5F",
                            fontWeight: 600,
                            fontSize: "12px",
                          }}
                        >
                          {chat.language === "id" ? "ID" : "EN"}
                        </span>
                      </td>
                      <td style={{ ...tableCellStyle, color: "#64748B" }}>
                        {new Date(chat.created_at).toLocaleString()}
                      </td>
                      <td style={tableCellStyle}>
                        <button
                          onClick={() => handleViewDetail(chat)}
                          style={buttonView}
                        >
                          View
                        </button>
                        <button
                          onClick={() => openDeleteModal(chat)}
                          style={buttonDelete}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  ...buttonPrimary,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Previous
              </button>
              <span style={{ color: "#64748B" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  ...buttonPrimary,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedChat && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={modalTitle}>Chat Details</h2>
            <div style={{ marginBottom: "20px", color: "#1E293B" }}>
              <strong>User:</strong> {selectedChat.user_name} (
              {selectedChat.user_email})
              <br />
              <strong>Language:</strong> {selectedChat.language}
              <br />
              <strong>Timestamp:</strong>{" "}
              {new Date(selectedChat.created_at).toLocaleString()}
            </div>
            <div style={modalBlock}>
              <strong>User Message:</strong>
              <p style={{ marginTop: "10px" }}>{selectedChat.user_message}</p>
            </div>
            <div style={{ ...modalBlock, background: "rgba(45, 122, 95, 0.08)" }}>
              <strong>AI Response:</strong>
              <p style={{ marginTop: "10px" }}>{selectedChat.ai_response}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedChat(null);
                }}
                style={buttonPrimary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && chatToDelete && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={modalTitle}>Delete Chat</h2>
            <p style={{ color: "#64748B" }}>
              Are you sure you want to delete this chat from{" "}
              <strong>{chatToDelete.user_name}</strong>? This action cannot be
              undone.
            </p>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setChatToDelete(null);
                }}
                style={buttonSecondary}
              >
                Cancel
              </button>
              <button onClick={handleDeleteChat} style={buttonDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* === THEME STYLES === */
const floatingBackgroundStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background:
    "linear-gradient(135deg, rgba(21,60,48,0.02), rgba(45,122,95,0.03))",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "32px",
};

const statCardStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  transition: "transform 0.3s ease",
};

const cardLabel = {
  textTransform: "uppercase",
  fontSize: "13px",
  color: "#64748B",
  fontWeight: 600,
  marginBottom: "8px",
};

const cardValue = {
  fontSize: "36px",
  color: "#1E293B",
  fontWeight: 700,
};

const filterBar = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "32px",
};

const inputStyle = {
  flex: "1",
  minWidth: "180px",
  padding: "10px 14px",
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
  color: "#1E293B",
  background: "#fff",
};

const buttonPrimary = {
  background: "linear-gradient(135deg, #153C30, #2D7A5F)",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.3s ease",
};

const buttonSecondary = {
  background: "#F8FAFB",
  color: "#153C30",
  padding: "10px 20px",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  cursor: "pointer",
};

const buttonView = {
  ...buttonSecondary,
  marginRight: "6px",
};

const buttonDelete = {
  background: "#EF4444",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "20px",
};

const tableWrapper = {
  overflowX: "auto",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderStyle = {
  padding: "14px 16px",
  textAlign: "left",
  color: "#153C30",
  fontWeight: 700,
  borderBottom: "2px solid #E5E7EB",
};

const tableCellStyle = {
  padding: "12px 16px",
  color: "#1E293B",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginTop: "32px",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "#fff",
  borderRadius: "16px",
  padding: "32px",
  maxWidth: "600px",
  width: "90%",
  boxShadow: "0 12px 24px rgba(21,60,48,0.12)",
};

const modalTitle = {
  color: "#153C30",
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "16px",
};

const modalBlock = {
  background: "#F8FAFB",
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "16px",
};
