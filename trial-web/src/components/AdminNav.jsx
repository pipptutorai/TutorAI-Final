import { Link, useLocation } from "react-router-dom";

export default function AdminNav() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", exact: true },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/documents", label: "Documents" },
    { path: "/admin/chats", label: "Chats" },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item) ? styles.navItemActive : {}),
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  container: {
    background: "#f9f9f9",
    borderBottom: "1px solid #e0e0e0",
  },
  nav: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    gap: "4px",
  },
  navItem: {
    padding: "12px 20px",
    color: "#666",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  navItemActive: {
    color: "#333",
    borderBottomColor: "#333",
  },
};
