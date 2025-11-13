import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";
import toast from "react-hot-toast";

export default function Navbar({ isAdmin = false }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleHome = () => {
    navigate(isAdmin ? "/admin" : "/");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1 style={styles.logo} onClick={handleHome}>
            TutorAI {isAdmin && <span style={styles.badge}>Admin</span>}
          </h1>
        </div>

        <div style={styles.rightSection}>
          {!isAdmin && (
            <button
              onClick={() => navigate("/history")}
              style={styles.navButton}
            >
              History
            </button>
          )}

          <span style={styles.userName}>{user?.name || "User"}</span>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "#153C30", // warna ijo tua
    borderBottom: "1px solid #0f2a21",
    padding: "0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff", // tulisan putih
    margin: 0,
    cursor: "pointer",
    userSelect: "none",
  },
  badge: {
    fontSize: "12px",
    fontWeight: "500",
    background: "#1e5442",
    color: "#ffffff",
    padding: "4px 8px",
    borderRadius: "4px",
    marginLeft: "8px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    fontSize: "14px",
    color: "#ffffff", // tulisan putih
    fontWeight: "500",
  },
  navButton: {
    padding: "8px 16px",
    background: "#1e5442",
    color: "#ffffff",
    border: "1px solid #1e5442",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  logoutButton: {
    padding: "8px 16px",
    background: "#ffffff",
    color: "#153C30",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

// opsional: kalau mau efek hover biar lebih interaktif
styles.navButton[":hover"] = {
  background: "#226e55",
};
styles.logoutButton[":hover"] = {
  background: "#e6e6e6",
};
