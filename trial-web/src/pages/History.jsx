import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { chatAPI } from "../lib/api";
import Navbar from "../components/Navbar";

export default function History() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getHistory(page, 20);
      setChats(response.data.data.chats);
      setTotalPages(response.data.data.pagination.total_pages);
    } catch (error) {
      console.error("Load history error:", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this conversation? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await chatAPI.deleteChat(id);
      toast.success("Conversation deleted");
      loadHistory();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete conversation");
    } finally {
      setDeleteLoading(null);
    }
  };

  const groupChatsByDate = (chats) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    chats.forEach((chat) => {
      const chatDate = new Date(chat.created_at);
      let label;

      if (chatDate.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      } else {
        label = chatDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(chat);
    });

    return groups;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading && page === 1) {
    return (
      <div style={styles.container}>
        <Navbar isAdmin={false} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading conversations...</p>
        </div>
      </div>
    );
  }

  const groupedChats = groupChatsByDate(chats);

  return (
    <div style={styles.container}>
      <Navbar isAdmin={false} />

      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Conversation History</h1>
            <p style={styles.subtitle}>
              View and manage your past conversations with TutorAI
            </p>
          </div>
        </div>

        {chats.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path
                  d="M48 40C48 40.55 47.55 41 47 41H17L9 49V16C9 15.45 9.45 15 10 15H47C47.55 15 48 15.45 48 16V40Z"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 style={styles.emptyTitle}>No conversations yet</h2>
            <p style={styles.emptyText}>
              Start chatting with TutorAI to see your conversation history here
            </p>
            <Link to="/home" style={styles.startButton}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M14 11C14 11.55 13.55 12 13 12H5L2 15V4C2 3.45 2.45 3 3 3H13C13.55 3 14 3.45 14 4V11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Start Conversation
            </Link>
          </div>
        ) : (
          <>
            <div style={styles.chatList}>
              {Object.entries(groupedChats).map(([date, dateChats]) => (
                <div key={date} style={styles.dateGroup}>
                  <div style={styles.dateLabel}>{date}</div>
                  {dateChats.map((chat) => (
                    <div key={chat.id} style={styles.chatCard}>
                      <div style={styles.cardHeader}>
                        <div style={styles.timeStamp}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <circle
                              cx="7"
                              cy="7"
                              r="6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M7 3.5V7L9.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          {formatTime(chat.created_at)}
                        </div>
                        <button
                          onClick={() => handleDelete(chat.id)}
                          disabled={deleteLoading === chat.id}
                          style={{
                            ...styles.deleteButton,
                            opacity: deleteLoading === chat.id ? 0.5 : 1,
                          }}
                        >
                          {deleteLoading === chat.id ? (
                            <div style={styles.smallSpinner}></div>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M2 4H14M12.67 4L12.08 12.5C12.03 13.33 11.33 14 10.5 14H5.5C4.67 14 3.97 13.33 3.92 12.5L3.33 4M6 4V2.5C6 2.22 6.22 2 6.5 2H9.5C9.78 2 10 2.22 10 2.5V4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      <div style={styles.cardBody}>
                        <div style={styles.messageSection}>
                          <div style={styles.messageLabel}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M2 13C2 11.34 3.34 10 5 10H11C12.66 10 14 11.34 14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            You
                          </div>
                          <p style={styles.messageText}>{chat.message}</p>
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.messageSection}>
                          <div style={styles.messageLabel}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M4 4L8 8L12 4M4 8L8 12L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            TutorAI
                          </div>
                          <p style={styles.messageText}>
                            {truncateText(chat.reply)}
                          </p>
                        </div>

                        {chat.sources && chat.sources.length > 0 && (
                          <div style={styles.sourceTag}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path
                                d="M7 2H3C2.45 2 2 2.45 2 3V11C2 11.55 2.45 12 3 12H11C11.55 12 12 11.55 12 11V7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            {chat.sources.length} source{chat.sources.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  style={{
                    ...styles.pageButton,
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M11 5L7 9L11 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Previous
                </button>

                <div style={styles.pageInfo}>
                  <span style={styles.currentPage}>{page}</span>
                  <span style={styles.pageDivider}>/</span>
                  <span style={styles.totalPages}>{totalPages}</span>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  style={{
                    ...styles.pageButton,
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                >
                  Next
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M7 5L11 9L7 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 64px)",
    gap: "16px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #0f172a",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: "15px",
    color: "#64748b",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    marginBottom: "24px",
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "24px",
    maxWidth: "400px",
  },
  startButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "#0f172a",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  dateGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  dateLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "0 4px",
  },
  chatCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
  },
  timeStamp: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748b",
  },
  deleteButton: {
    padding: "6px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
  },
  smallSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #64748b",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  cardBody: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  messageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  messageLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  messageText: {
    fontSize: "14px",
    color: "#0f172a",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },
  divider: {
    height: "1px",
    background: "#e5e7eb",
  },
  sourceTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "#f1f5f9",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#64748b",
    alignSelf: "flex-start",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "32px",
    padding: "20px 0",
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  currentPage: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  },
  pageDivider: {
    fontSize: "14px",
    color: "#cbd5e1",
  },
  totalPages: {
    fontSize: "14px",
    color: "#64748b",
  },
};

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    [style*="chatCard"]:hover {
      border-color: #cbd5e1 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
    }
    
    [style*="deleteButton"]:hover:not(:disabled) {
      background: #fef2f2 !important;
      color: #ef4444 !important;
    }
    
    [style*="startButton"]:hover {
      background: #1e293b !important;
    }
    
    [style*="pageButton"]:hover:not(:disabled) {
      border-color: #cbd5e1 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}