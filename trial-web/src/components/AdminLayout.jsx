import Navbar from "./Navbar";
import AdminNav from "./AdminNav";

export default function AdminLayout({ children, title }) {
  return (
    <div style={styles.container}>
      <Navbar isAdmin={true} />
      <AdminNav />

      <div style={styles.content}>
        {title && <h2 style={styles.pageTitle}>{title}</h2>}
        {children}
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
};
