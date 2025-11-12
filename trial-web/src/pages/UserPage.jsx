import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { chatAPI } from "../lib/api";
import { getUser } from "../utils/auth";
import Navbar from "../components/Navbar";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const suggestedQuestions = [
    {
      icon: "🌾",
      category: "Crop Management",
      question: "What are the best practices for sustainable rice cultivation?",
      color: "#059669",
    },
    {
      icon: "🌱",
      category: "Soil Science",
      question: "How can I improve soil fertility naturally?",
      color: "#10b981",
    },
    {
      icon: "💧",
      category: "Irrigation",
      question: "Explain drip irrigation systems for vegetable farming",
      color: "#14b8a6",
    },
    {
      icon: "🦠",
      category: "Plant Disease",
      question: "How to identify and prevent common plant diseases?",
      color: "#06b6d4",
    },
  ];

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || message.trim();
    if (!messageToSend) return;

    setMessage("");
    
    const userMessage = {
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setChats((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageToSend);
      const data = response.data.data;

      setChats((prev) => [
        ...prev,
        {
          type: "ai",
          content: data.reply,
          sources: data.sources,
          timestamp: new Date(data.created_at),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
      setChats((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <Navbar isAdmin={false} />

      <div style={styles.chatContainer}>
        {chats.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyHeader}>
              <div style={styles.avatarLarge}>
                <div style={styles.avatarInner}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 12C24 12 18 16 18 22C18 25 20 27 24 27C28 27 30 25 30 22C30 16 24 12 24 12Z" fill="white"/>
                    <path d="M24 27V39M24 39L20 35M24 39L28 35" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 style={styles.emptyTitle}>AgroAI Scholar Assistant</h2>
              <p style={styles.emptySubtitle}>Your Agricultural Research Companion</p>
              <p style={styles.emptyText}>
                I'm here to help you with agricultural research, crop management, soil science, sustainable farming practices, and more. Ask me anything related to your graduate studies.
              </p>
            </div>

            <div style={styles.suggestedSection}>
              <h3 style={styles.suggestedTitle}>
                <span style={styles.titleIcon}>🎯</span>
                Popular topics to explore
              </h3>
              <div style={styles.suggestedGrid}>
                {suggestedQuestions.map((item, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.suggestedCard,
                      borderLeftColor: item.color,
                    }}
                    onClick={() => handleSendMessage(item.question)}
                  >
                    <div style={styles.cardHeader}>
                      <span style={styles.cardIcon}>{item.icon}</span>
                      <span style={{...styles.cardCategory, color: item.color}}>
                        {item.category}
                      </span>
                    </div>
                    <div style={styles.cardQuestion}>{item.question}</div>
                    <div style={styles.cardFooter}>
                      <span style={styles.askText}>Ask this question</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.statsBar}>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>📚</span>
                <div>
                  <div style={styles.statValue}>10K+</div>
                  <div style={styles.statLabel}>Research Papers</div>
                </div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>🌍</span>
                <div>
                  <div style={styles.statValue}>50+</div>
                  <div style={styles.statLabel}>Countries</div>
                </div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>🎓</span>
                <div>
                  <div style={styles.statValue}>24/7</div>
                  <div style={styles.statLabel}>Available</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.chatMessages}>
            {chats.map((chat, index) => (
              <div
                key={index}
                style={
                  chat.type === "user"
                    ? styles.userMessageWrapper
                    : styles.aiMessageWrapper
                }
              >
                <div style={styles.messageAvatar}>
                  {chat.type === "user" ? (
                    <div style={styles.userAvatar}>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  ) : (
                    <div style={styles.aiAvatar}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5C10 5 7 7 7 10C7 11.5 8 12.5 10 12.5C12 12.5 13 11.5 13 10C13 7 10 5 10 5Z" fill="white"/>
                        <path d="M10 12.5V17M10 17L8 15M10 17L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div style={styles.messageContainer}>
                  <div style={styles.messageHeader}>
                    <span style={styles.messageSender}>
                      {chat.type === "user" ? user?.name || "You" : "AgroAI Scholar"}
                    </span>
                    {chat.type === "ai" && (
                      <span style={styles.aiTag}>AI Assistant</span>
                    )}
                    <span style={styles.messageTime}>
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  
                  <div
                    style={
                      chat.type === "user"
                        ? styles.userMessageBubble
                        : styles.aiMessageBubble
                    }
                  >
                    {chat.content}
                  </div>

                  {chat.sources && chat.sources.length > 0 && (
                    <div style={styles.sourcesContainer}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M7 2H3C2.45 2 2 2.45 2 3V11C2 11.55 2.45 12 3 12H11C11.55 12 12 11.55 12 11V7M9 2H12M12 2V5M12 2L6 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        {chat.sources.length} research source{chat.sources.length > 1 ? "s" : ""} referenced
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.aiMessageWrapper}>
                <div style={styles.messageAvatar}>
                  <div style={{...styles.aiAvatar, ...styles.aiAvatarPulse}}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 5C10 5 7 7 7 10C7 11.5 8 12.5 10 12.5C12 12.5 13 11.5 13 10C13 7 10 5 10 5Z" fill="white"/>
                      <path d="M10 12.5V17M10 17L8 15M10 17L12 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div style={styles.messageContainer}>
                  <div style={styles.messageHeader}>
                    <span style={styles.messageSender}>AgroAI Scholar</span>
                    <span style={styles.aiTag}>AI Assistant</span>
                  </div>
                  <div style={styles.loadingBubble}>
                    <span style={styles.loadingText}>Analyzing agricultural data</span>
                    <div style={styles.loadingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <div style={styles.inputBox}>
            <div style={styles.inputIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14 11C14 11.55 13.55 12 13 12H5L2 15V4C2 3.45 2.45 3 3 3H13C13.55 3 14 3.45 14 4V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crops, soil, irrigation, diseases, or any agricultural topic..."
              style={styles.textarea}
              disabled={loading}
              rows={1}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !message.trim()}
              style={styles.sendButton}
            >
              {loading ? (
                <div style={styles.sendingSpinner}></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <div style={styles.inputHint}>
            <kbd style={styles.kbd}>Enter</kbd> to send • <kbd style={styles.kbd}>Shift + Enter</kbd> for new line • Powered by Agricultural AI
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, #f0fdf4 0%, #dcfce7 100%)",
  },
  chatContainer: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    maxWidth: "1100px",
    margin: "0 auto",
    width: "100%",
  },
  emptyHeader: {
    textAlign: "center",
    marginBottom: "48px",
  },
  avatarLarge: {
    width: "120px",
    height: "120px",
    margin: "0 auto 24px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 20px 60px rgba(5, 150, 105, 0.3)",
    animation: "float 3s ease-in-out infinite",
    position: "relative",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#065f46",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  emptySubtitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#059669",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#57534e",
    lineHeight: "1.7",
    maxWidth: "600px",
    margin: "0 auto",
  },
  suggestedSection: {
    width: "100%",
    marginBottom: "40px",
  },
  suggestedTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#065f46",
    marginBottom: "24px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  titleIcon: {
    fontSize: "20px",
  },
  suggestedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  suggestedCard: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
    background: "white",
    border: "2px solid #d1d5db",
    borderLeft: "4px solid",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardIcon: {
    fontSize: "24px",
  },
  cardCategory: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardQuestion: {
    fontSize: "14px",
    color: "#1c1917",
    fontWeight: "500",
    lineHeight: "1.5",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#78716c",
  },
  askText: {
    fontSize: "12px",
    fontWeight: "500",
  },
  statsBar: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    padding: "24px 32px",
    background: "white",
    border: "2px solid #d1d5db",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statIcon: {
    fontSize: "32px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#065f46",
  },
  statLabel: {
    fontSize: "12px",
    color: "#78716c",
    fontWeight: "500",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "#e5e7eb",
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
  },
  userMessageWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  aiMessageWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  messageAvatar: {
    flexShrink: 0,
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #0c4a6e 0%, #075985 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(12, 74, 110, 0.3)",
  },
  aiAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
  },
  aiAvatarPulse: {
    animation: "pulse 2s ease-in-out infinite",
  },
  messageContainer: {
    flex: 1,
    minWidth: 0,
  },
  messageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    flexWrap: "wrap",
  },
  messageSender: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1c1917",
  },
  aiTag: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#059669",
    background: "#d1fae5",
    padding: "2px 8px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  messageTime: {
    fontSize: "12px",
    color: "#a8a29e",
    marginLeft: "auto",
  },
  userMessageBubble: {
    padding: "16px 20px",
    background: "linear-gradient(135deg, #0c4a6e 0%, #075985 100%)",
    color: "white",
    borderRadius: "18px",
    borderTopLeftRadius: "4px",
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    boxShadow: "0 4px 12px rgba(12, 74, 110, 0.2)",
  },
  aiMessageBubble: {
    padding: "16px 20px",
    background: "white",
    border: "2px solid #d1d5db",
    borderRadius: "18px",
    borderTopLeftRadius: "4px",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#1c1917",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  sourcesContainer: {
    marginTop: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    background: "#f0fdf4",
    border: "1.5px solid #bbf7d0",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#065f46",
    fontWeight: "500",
  },
  loadingBubble: {
    padding: "16px 20px",
    background: "white",
    border: "2px solid #d1d5db",
    borderRadius: "18px",
    borderTopLeftRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  loadingText: {
    fontSize: "14px",
    color: "#78716c",
    marginBottom: "8px",
    fontStyle: "italic",
  },
  loadingDots: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  inputContainer: {
    background: "white",
    borderTop: "2px solid #d1d5db",
    padding: "20px 24px",
    boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.03)",
  },
  inputWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  inputBox: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    background: "#fafaf9",
    border: "2px solid #d6d3d1",
    borderRadius: "16px",
    padding: "12px 16px",
    transition: "all 0.2s",
  },
  inputIcon: {
    color: "#78716c",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    paddingTop: "8px",
  },
  textarea: {
    flex: 1,
    padding: "8px 4px",
    border: "none",
    background: "transparent",
    fontSize: "15px",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: "1.5",
    minHeight: "24px",
    maxHeight: "200px",
    color: "#1c1917",
  },
  sendButton: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
  },
  sendingSpinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  inputHint: {
    marginTop: "12px",
    fontSize: "12px",
    color: "#a8a29e",
    textAlign: "center",
  },
  kbd: {
    padding: "2px 6px",
    background: "white",
    border: "1.5px solid #d6d3d1",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "monospace",
    color: "#57534e",
    fontWeight: "600",
  },
};

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(0.95); }
    }
    
    @keyframes dotFlashing {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1); }
    }
    
    [style*="loadingDots"] span {
      width: 8px;
      height: 8px;
      border-radius: "50%",
      background: "#059669",
      animation: dotFlashing 1.4s infinite;
    }
    
    [style*="loadingDots"] span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    [style*="loadingDots"] span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    [style*="inputBox"]:focus-within {
      border-color: #059669 !important;
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
      background: white !important;
    }
    
    [style*="sendButton"]:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4) !important;
    }
    
    [style*="sendButton"]:active:not(:disabled) {
      transform: translateY(0);
    }
    
    [style*="sendButton"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    [style*="suggestedCard"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
      border-color: #a8a29e !important;
    }
    
    [style*="chatMessages"]::-webkit-scrollbar {
      width: 8px;
    }
    
    [style*="chatMessages"]::-webkit-scrollbar-track {
      background: transparent;
    }
    
    [style*="chatMessages"]::-webkit-scrollbar-thumb {
      background: #d6d3d1;
      border-radius: 4px;
    }
    
    [style*="chatMessages"]::-webkit-scrollbar-thumb:hover {
      background: #a8a29e;
    }
    
    @media (max-width: 768px) {
      [style*="suggestedGrid"] {
        grid-template-columns: 1fr !important;
      }
      
      [style*="emptyTitle"] {
        font-size: 28px !important;
      }
      
      [style*="statsBar"] {
        flex-direction: column;
        gap: 16px !important;
      }
      
      [style*="statDivider"] {
        display: none;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}