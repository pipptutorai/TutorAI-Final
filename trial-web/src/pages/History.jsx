import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { chatAPI } from "../lib/api";
import Navbar from "../components/Navbar";

export default function History() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
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
    if (!confirm("Delete this chat?")) return;

    try {
      await chatAPI.deleteChat(id);
      toast.success("Chat deleted");
      loadHistory();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete chat");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar isAdmin={false} />
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar isAdmin={false} />

      <div style={styles.content}>
        {chats.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No chat history yet</p>
            <Link to="/home" style={styles.startButton}>
              Start Chatting
            </Link>
          </div>
        ) : (
          <div style={styles.chatList}>
            {chats.map((chat) => (
              <div key={chat.id} style={styles.chatCard}>
                <div style={styles.chatHeader}>
                  <span style={styles.timestamp}>
                    {new Date(chat.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
                <div style={styles.chatBody}>
                  <div style={styles.message}>
                    <strong>You:</strong> {chat.message}
                  </div>
                  <div style={styles.reply}>
                    <strong>AI:</strong> {chat.reply.substring(0, 200)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={styles.pageButton}
            >
              Previous
            </button>
            <span style={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={styles.pageButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f9f9f9",
  },
  content: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "18px",
    color: "#666",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
  },
  startButton: {
    display: "inline-block",
    marginTop: "16px",
    padding: "12px 24px",
    background: "#333",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "500",
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  chatCard: {
    background: "white",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    padding: "16px",
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  timestamp: {
    fontSize: "14px",
    color: "#666",
  },
  deleteButton: {
    padding: "4px 12px",
    background: "#666",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
  chatBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  message: {
    fontSize: "14px",
    color: "#333",
  },
  reply: {
    fontSize: "14px",
    color: "#555",
    paddingLeft: "16px",
    borderLeft: "2px solid #333",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "24px",
  },
  pageButton: {
    padding: "8px 16px",
    background: "#333",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#666",
  },
};
