import { useState, useEffect, useRef } from "react";
import { adminDocumentsAPI } from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";
import CustomSelect from "../../components/CustomSelect";
import "./AdminDocuments.css"; 

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Load documents
  useEffect(() => {
    loadDocuments();
  }, [currentPage, statusFilter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const response = await adminDocumentsAPI.getDocuments(params);
      const documentsData = response.data.data || response.data;
      setDocuments(documentsData.documents || []);

      const paginationData = documentsData.pagination || {};
      const totalCount = paginationData.total || documentsData.total || 0;
      setTotalPages(Math.ceil(totalCount / limit));
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select a PDF file");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please drop a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return setError("Please select a file");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("document", selectedFile);
      await adminDocumentsAPI.uploadDocument(formData);
      setSelectedFile(null);
      fileInputRef.current.value = "";
      loadDocuments();
      alert("Document uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleReindex = async (docId) => {
    try {
      await adminDocumentsAPI.reindexDocument(docId);
      alert("Document queued for re-indexing");
      loadDocuments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reindex document");
    }
  };

  const handleEmbed = async (docId) => {
    try {
      await adminDocumentsAPI.embedDocument(docId);
      alert("Document queued for embedding generation");
      loadDocuments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start embedding");
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await adminDocumentsAPI.deleteDocument(documentToDelete.id);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
      loadDocuments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete document");
    }
  };

  const openDeleteModal = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: "#fff3cd", color: "#856404" },
      processing: { bg: "#cfe2ff", color: "#084298" },
      completed: { bg: "#d1e7dd", color: "#0f5132" },
      failed: { bg: "#f8d7da", color: "#842029" },
    };
    const style = statusStyles[status] || statusStyles.pending;
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          background: style.bg,
          color: style.color,
          fontWeight: "500",
          textTransform: "capitalize",
        }}
      >
        {status}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <AdminLayout title="📄 Document Management">
      {/* Upload Section */}
      <div className="card">
        <h2 className="section-title">Upload PDF Document</h2>

        <div
          className={`dropzone ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <p>
            {selectedFile ? (
              <>
                <strong>{selectedFile.name}</strong>
                <br />
                {formatFileSize(selectedFile.size)}
              </>
            ) : (
              <>
                Drag & drop PDF file here or click to browse
                <br />
                <small>Supported format: PDF only</small>
              </>
            )}
          </p>
        </div>

        <div className="button-row">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`btn ${!selectedFile || uploading ? "btn-disabled" : "btn-primary"}`}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
          {selectedFile && (
            <button
              onClick={() => {
                setSelectedFile(null);
                fileInputRef.current.value = "";
              }}
              className="btn btn-danger"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="dropdown-wrapper">
          <CustomSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" },
            ]}
          />
        </div>

        <button onClick={loadDocuments} className="btn btn-primary">
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-box">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="loading">Loading documents...</div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Status</th>
                <th>Size</th>
                <th>Chunks</th>
                <th>Embeddings</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="truncate">{doc.filename}</td>
                    <td>{getStatusBadge(doc.status)}</td>
                    <td>{formatFileSize(doc.file_size || 0)}</td>
                    <td>{doc.chunk_count || 0}</td>
                    <td>
                      {doc.chunk_count > 0 ? (
                        <>
                          <strong>
                            {doc.embedded_count || 0} / {doc.chunk_count || 0}
                          </strong>
                          {doc.pending_count > 0 && (
                            <div className="text-warning">
                              {doc.pending_count} pending
                            </div>
                          )}
                          {doc.failed_count > 0 && (
                            <div className="text-danger">
                              {doc.failed_count} failed
                            </div>
                          )}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{new Date(doc.created_at).toLocaleString()}</td>
                    <td>
                      {doc.status === "failed" && (
                        <button
                          onClick={() => handleReindex(doc.id)}
                          className="btn btn-warning btn-sm"
                        >
                          Reindex
                        </button>
                      )}
                      {doc.status === "completed" && (
                        <button
                          onClick={() => handleEmbed(doc.id)}
                          className="btn btn-info btn-sm"
                        >
                          Embed
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(doc)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`btn btn-sm ${currentPage === 1 ? "btn-disabled" : "btn-primary"}`}
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`btn btn-sm ${currentPage === totalPages ? "btn-disabled" : "btn-primary"}`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && documentToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Document</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{documentToDelete.filename}</strong>? This will also delete
              all associated chunks.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDocumentToDelete(null);
                }}
                className="btn btn-light"
              >
                Cancel
              </button>
              <button onClick={handleDeleteDocument} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
