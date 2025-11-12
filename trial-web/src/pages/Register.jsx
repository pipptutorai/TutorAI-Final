import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logoContainer}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M10 10L16 16L22 10M10 16L16 22L22 16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 style={styles.brandName}>TutorAI</h1>
          <p style={styles.brandTagline}>
            Join thousands of students learning smarter with AI
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Active Students</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>98%</div>
            <div style={styles.statLabel}>Satisfaction</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>AI Support</div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <h2 style={styles.title}>Create account</h2>
            <p style={styles.subtitle}>
              Start your learning journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength="6"
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 2L16 16M9 6C10.66 6 12 7.34 12 9C12 9.34 11.94 9.66 11.84 9.97M9 12C7.34 12 6 10.66 6 9C6 8.66 6.06 8.34 6.16 8.03M1 9C1.93 7.31 3.38 5.93 5.13 5.13M17 9C16.07 10.69 14.62 12.07 12.87 12.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <p style={styles.hint}>Must be at least 6 characters</p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 2L16 16M9 6C10.66 6 12 7.34 12 9C12 9.34 11.94 9.66 11.84 9.97M9 12C7.34 12 6 10.66 6 9C6 8.66 6.06 8.34 6.16 8.03M1 9C1.93 7.31 3.38 5.93 5.13 5.13M17 9C16.07 10.69 14.62 12.07 12.87 12.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  <span>Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={styles.footerText}>Already have an account?</span>
            <Link to="/login" style={styles.footerLink}>
              Sign in
            </Link>
          </div>
        </div>

        <div style={styles.legal}>
          By creating an account, you agree to our{" "}
          <a href="#" style={styles.legalLink}>Terms</a> and{" "}
          <a href="#" style={styles.legalLink}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  leftPanel: {
    flex: "0 0 45%",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  brandSection: {
    position: "relative",
    zIndex: 2,
  },
  logoContainer: {
    width: "56px",
    height: "56px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    backdropFilter: "blur(10px)",
  },
  brandName: {
    fontSize: "40px",
    fontWeight: "700",
    color: "white",
    marginBottom: "12px",
    letterSpacing: "-0.03em",
  },
  brandTagline: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: "1.6",
    maxWidth: "360px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    position: "relative",
    zIndex: 2,
  },
  statItem: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "24px 16px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.6)",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
    background: "#ffffff",
  },
  formWrapper: {
    maxWidth: "400px",
    width: "100%",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: "15px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.2s",
    color: "#0f172a",
    background: "white",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  hint: {
    fontSize: "13px",
    color: "#94a3b8",
  },
  submitButton: {
    padding: "12px",
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },
  footerText: {
    fontSize: "14px",
    color: "#64748b",
  },
  footerLink: {
    fontSize: "14px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "600",
  },
  legal: {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  legalLink: {
    color: "#64748b",
    textDecoration: "none",
  },
};

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    input:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    button[type="submit"]:hover:not(:disabled) {
      background: #1e293b !important;
    }
    
    button[type="button"]:hover {
      color: #3b82f6 !important;
    }
    
    a:hover {
      color: #2563eb !important;
    }
    
    @media (max-width: 1024px) {
      [style*="leftPanel"] {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}