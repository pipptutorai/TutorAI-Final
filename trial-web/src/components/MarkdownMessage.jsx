import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ node, ...props }) => <h1 style={styles.h1} {...props} />,
        h2: ({ node, ...props }) => <h2 style={styles.h2} {...props} />,
        h3: ({ node, ...props }) => <h3 style={styles.h3} {...props} />,

        // Paragraphs
        p: ({ node, ...props }) => <p style={styles.p} {...props} />,

        // Strong (bold)
        strong: ({ node, ...props }) => (
          <strong style={styles.strong} {...props} />
        ),

        // Emphasis (italic)
        em: ({ node, ...props }) => <em style={styles.em} {...props} />,

        // Lists
        ul: ({ node, ...props }) => <ul style={styles.ul} {...props} />,
        ol: ({ node, ...props }) => <ol style={styles.ol} {...props} />,
        li: ({ node, ...props }) => <li style={styles.li} {...props} />,

        // Code
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code style={styles.inlineCode} {...props} />
          ) : (
            <code style={styles.codeBlock} {...props} />
          ),
        pre: ({ node, ...props }) => <pre style={styles.pre} {...props} />,

        // Links
        a: ({ node, ...props }) => (
          <a
            style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // Blockquote
        blockquote: ({ node, ...props }) => (
          <blockquote style={styles.blockquote} {...props} />
        ),

        // Table
        table: ({ node, ...props }) => (
          <div style={styles.tableWrapper}>
            <table style={styles.table} {...props} />
          </div>
        ),
        th: ({ node, ...props }) => <th style={styles.th} {...props} />,
        td: ({ node, ...props }) => <td style={styles.td} {...props} />,

        // Horizontal rule
        hr: ({ node, ...props }) => <hr style={styles.hr} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

const styles = {
  h1: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#153C30",
    marginTop: "20px",
    marginBottom: "12px",
    lineHeight: "1.3",
  },
  h2: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#153C30",
    marginTop: "18px",
    marginBottom: "10px",
    lineHeight: "1.3",
  },
  h3: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A4D3C",
    marginTop: "16px",
    marginBottom: "8px",
    lineHeight: "1.3",
  },
  p: {
    margin: "8px 0",
    lineHeight: "1.7",
  },
  strong: {
    fontWeight: "700",
    color: "#153C30",
  },
  em: {
    fontStyle: "italic",
    color: "#1A4D3C",
  },
  ul: {
    marginLeft: "20px",
    marginTop: "8px",
    marginBottom: "8px",
  },
  ol: {
    marginLeft: "20px",
    marginTop: "8px",
    marginBottom: "8px",
  },
  li: {
    marginBottom: "6px",
    lineHeight: "1.6",
  },
  inlineCode: {
    background: "#F1F5F9",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    color: "#DC2626",
    border: "1px solid #E2E8F0",
  },
  codeBlock: {
    display: "block",
    background: "#1E293B",
    color: "#E2E8F0",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    overflowX: "auto",
    lineHeight: "1.5",
  },
  pre: {
    margin: "12px 0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  link: {
    color: "#2D7A5F",
    textDecoration: "underline",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  blockquote: {
    borderLeft: "4px solid #2D7A5F",
    paddingLeft: "16px",
    marginLeft: "0",
    marginTop: "12px",
    marginBottom: "12px",
    color: "#64748B",
    fontStyle: "italic",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "12px",
    marginBottom: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    background: "#F1F5F9",
    padding: "10px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "2px solid #E2E8F0",
    color: "#153C30",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #E2E8F0",
  },
  hr: {
    border: "none",
    borderTop: "2px solid #E2E8F0",
    margin: "16px 0",
  },
};
