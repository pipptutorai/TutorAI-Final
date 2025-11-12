import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../lib/api";
import { saveAuth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data.data;

      saveAuth(user, token);
      toast.success("Welcome back");

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logoMark}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M8 8L20 20L32 8M8 20L20 32L32 20"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 style={styles.brandName}>TutorAI</h1>
          <p style={styles.brandTagline}>
            Advanced AI-powered learning platform for the next generation
          </p>
        </div>

        <div style={styles.testimonial}>
          <div style={styles.quoteIcon}>"</div>
          <p style={styles.quote}>
            TutorAI transformed the way I learn. The AI responses are incredibly
            accurate and helpful for my studies.
          </p>
          <div style={styles.author}>
            <div style={styles.authorAvatar}>JD</div>
            <div>
              <div style={styles.authorName}>Jessica Davis</div>
              <div style={styles.authorTitle}>Computer Science Student</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.header}>
            <h2 style={styles.title}>Sign in</h2>
            <p style={styles.subtitle}>
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
                <button
                  type="button"
                  style={styles.forgotLink}
                  onClick={() => toast("Password reset coming soon")}
                >
                  Forgot?
                </button>
              </div>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 3L17 17M10 7C11.66 7 13 8.34 13 10C13 10.34 12.94 10.66 12.84 10.97M10 13C8.34 13 7 11.66 7 10C7 9.66 7.06 9.34 7.16 9.03M2 10C2.93 8.31 4.38 6.93 6.13 6.13M18 10C17.07 11.69 15.62 13.07 13.87 13.87"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
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
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={styles.footerText}>Don't have an account?</span>
            <Link to="/register" style={styles.footerLink}>
              Sign up
            </Link>
          </div>
        </div>

        <div style={styles.bottomNote}>
          <p style={styles.noteText}>
            By continuing, you agree to TutorAI's{" "}
            <a href="#" style={styles.noteLink}>
              Terms
            </a>{" "}
            and{" "}
            <a href="#" style={styles.noteLink}>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  leftPanel: {
    flex: "0 0 45%",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
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
  logoMark: {
    width: "64px",
    height: "64px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    backdropFilter: "blur(10px)",
  },
  brandName: {
    fontSize: "48px",
    fontWeight: "700",
    color: "white",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  brandTagline: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: "1.6",
    maxWidth: "400px",
  },
  testimonial: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    padding: "32px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    zIndex: 2,
  },
  quoteIcon: {
    fontSize: "64px",
    color: "rgba(255, 255, 255, 0.2)",
    lineHeight: "1",
    marginBottom: "16px",
  },
  quote: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: "1.7",
    marginBottom: "24px",
  },
  author: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  authorAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
  },
  authorName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    marginBottom: "2px",
  },
  authorTitle: {
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
  formContainer: {
    maxWidth: "400px",
    width: "100%",
    margin: "0 auto",
  },
  header: {
    marginBottom: "40px",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  },
  forgotLink: {
    fontSize: "14px",
    color: "#3b82f6",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "15px",
    border: "1px solid #e2e8f0",
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
  submitButton: {
    padding: "14px",
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
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  footer: {
    marginTop: "32px",
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
  bottomNote: {
    marginTop: "40px",
    textAlign: "center",
  },
  noteText: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.5",
  },
  noteLink: {
    color: "#64748b",
    textDecoration: "underline",
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
      text-decoration: underline !important;
    }
    
    @media (max-width: 1024px) {
      [style*="leftPanel"] {
        display: none !important;
      }
      [style*="rightPanel"] {
        flex: 1 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}