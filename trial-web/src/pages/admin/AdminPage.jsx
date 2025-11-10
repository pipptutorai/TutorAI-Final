import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { adminStatsAPI } from "../../lib/api";
import Navbar from "../../components/Navbar";
import AdminNav from "../../components/AdminNav";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminStatsAPI.getOverview();
      setStats(response.data.data);
    } catch (error) {
      console.error("Load stats error:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar isAdmin={true} />
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar isAdmin={true} />
      <AdminNav />

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>Dashboard</h2>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Users</div>
            <div style={styles.statValue}>{stats?.total_users || 0}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Users</div>
            <div style={styles.statValue}>{stats?.active_users || 0}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Chats</div>
            <div style={styles.statValue}>{stats?.total_chats || 0}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Chats Today</div>
            <div style={styles.statValue}>{stats?.chats_today || 0}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Documents</div>
            <div style={styles.statValue}>{stats?.total_documents || 0}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Indexed Docs</div>
            <div style={styles.statValue}>
              {stats?.completed_documents || 0}
            </div>
          </div>
        </div>
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
    maxWidth: "1400px",
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "24px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    color: "#666",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    background: "white",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    padding: "20px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "8px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#333",
  },
};
