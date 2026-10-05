"use client";

import { useEffect, useState } from "react";
import {
  FolderOpen,
  FileText,
  Video,
  Link as LinkIcon,
  Loader2,
  Download,
  Eye,
  X,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

const TYPE_ICON = {
  pdf: FileText,
  video: Video,
  folder: FolderOpen,
  link: LinkIcon,
  image: FileText,
};

function formatSize(bytes) {
  if (!bytes) return "";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Try to determine the material type safely.
 */
function getMaterialType(material) {
  if (material.type) {
    return material.type.toLowerCase();
  }

  const url = material.url?.toLowerCase() || "";

  if (url.includes(".pdf")) return "pdf";
  if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/)) return "video";
  if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/)) return "image";

  return "link";
}

/**
 * Get a filename for downloading.
 */
function getFileName(material) {
  if (material.fileName) {
    return material.fileName;
  }

  if (material.title) {
    const cleanTitle = material.title.replace(/[<>:"/\\|?*]+/g, "").trim();

    if (getMaterialType(material) === "pdf") {
      return `${cleanTitle || "document"}.pdf`;
    }

    return cleanTitle || "download";
  }

  return "download";
}

/**
 * Download using fetch when possible.
 *
 * If Cloudinary doesn't allow browser fetch/CORS,
 * fallback to opening the file in a new tab.
 */
async function downloadFile(material) {
  if (!material?.url) return;

  const url = material.url;
  const fileName = getFileName(material);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn(
      "Direct download failed, opening file in a new tab instead.",
      error,
    );

    // Fallback for Cloudinary/CORS restrictions.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function StudyMaterialsWidget() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .getMyStudentMaterials()
      .then((res) => {
        if (!cancelled) {
          setMaterials(res.data?.materials || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load materials.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Group materials by subject.
   */
  const grouped = materials.reduce((acc, material) => {
    const key = material.subject || "General";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(material);

    return acc;
  }, {});

  /**
   * Open preview modal.
   */
  const openPreview = (material) => {
    setPreviewError(false);
    setSelectedMaterial(material);
  };

  /**
   * Close preview modal.
   */
  const closePreview = () => {
    setSelectedMaterial(null);
    setPreviewError(false);
  };

  /**
   * Download selected file.
   */
  const handleDownload = async (material) => {
    try {
      setDownloading(true);
      await downloadFile(material);
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Handle clicking a material.
   */
  const handleMaterialClick = (event, material) => {
    const type = getMaterialType(material);

    // Normal links should open directly.
    if (type === "link") {
      return;
    }

    event.preventDefault();

    openPreview(material);
  };

  return (
    <>
      <div className="dashboard-card p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="stat-icon-box stat-icon-violet">
            <FolderOpen className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Study Materials
            </h3>

            <p className="text-xs text-slate-400">Shared by your teachers</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading…
          </div>
        ) : error ? (
          /* Error */
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />

            <p className="text-sm text-rose-500">{error}</p>
          </div>
        ) : materials.length === 0 ? (
          /* Empty */
          <div className="text-center py-8">
            <FolderOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />

            <p className="text-sm text-slate-400">No materials shared yet.</p>
          </div>
        ) : (
          /* Materials */
          <div className="space-y-5">
            {Object.entries(grouped).map(([subject, items]) => (
              <div key={subject}>
                {/* Subject */}
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {subject}
                </p>

                <div className="space-y-2">
                  {items.map((material) => {
                    const type = getMaterialType(material);

                    const Icon = TYPE_ICON[type] || FileText;

                    return (
                      <div
                        key={material._id}
                        className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Information */}
                        <button
                          type="button"
                          onClick={(event) =>
                            handleMaterialClick(event, material)
                          }
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className="text-xs font-bold text-foreground truncate">
                            {material.title || "Untitled Material"}
                          </p>

                          <div className="flex items-center gap-2 mt-0.5">
                            {material.fileSize > 0 && (
                              <p className="text-[10px] text-slate-400">
                                {formatSize(material.fileSize)}
                              </p>
                            )}

                            <span className="text-[10px] uppercase text-slate-400">
                              {type}
                            </span>
                          </div>
                        </button>

                        {/* Preview button */}
                        {type !== "link" && (
                          <button
                            type="button"
                            onClick={() => openPreview(material)}
                            title="Preview"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Download button */}
                        {type !== "link" && (
                          <button
                            type="button"
                            onClick={() => handleDownload(material)}
                            disabled={downloading}
                            title="Download"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors shrink-0 disabled:opacity-50"
                          >
                            {downloading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* External link */}
                        {type === "link" && material.url && (
                          <a
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open link"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          PREVIEW MODAL
      ========================================================= */}
      {selectedMaterial && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePreview();
            }
          }}
        >
          <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="min-w-0">
                <h2 className="font-bold text-foreground truncate">
                  {selectedMaterial.title || "Study Material"}
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedMaterial.subject || "General"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Download */}
                <button
                  type="button"
                  onClick={() => handleDownload(selectedMaterial)}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download
                </button>

                {/* Open in new tab */}
                <a
                  href={selectedMaterial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Close */}
                <button
                  type="button"
                  onClick={closePreview}
                  className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-300 transition"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 min-h-0 bg-slate-100 dark:bg-slate-900">
              {previewError ? (
                /* Preview fallback */
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-rose-500" />
                  </div>

                  <h3 className="font-bold text-foreground mb-1">
                    Preview unavailable
                  </h3>

                  <p className="text-sm text-slate-400 max-w-md mb-5">
                    This file cannot be previewed in the browser. You can
                    download it or open it in a new tab.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDownload(selectedMaterial)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </button>

                    <a
                      href={selectedMaterial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-foreground"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                  </div>
                </div>
              ) : (
                <MaterialPreview
                  material={selectedMaterial}
                  onError={() => setPreviewError(true)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * =========================================================
 * MATERIAL PREVIEW
 * =========================================================
 */
function MaterialPreview({ material, onError }) {
  const type = getMaterialType(material);

  /**
   * PDF
   */
  if (type === "pdf") {
    return (
      <iframe
        src={material.url}
        title={material.title || "PDF Preview"}
        className="w-full h-full border-0 bg-white"
        onError={onError}
      />
    );
  }

  /**
   * Video
   */
  if (type === "video") {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <video
          src={material.url}
          controls
          className="max-w-full max-h-full rounded-xl shadow-lg"
          onError={onError}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  /**
   * Image
   */
  if (type === "image") {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 overflow-auto">
        <img
          src={material.url}
          alt={material.title || "Study material"}
          className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
          onError={onError}
        />
      </div>
    );
  }

  /**
   * Link / Other
   */
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <LinkIcon className="w-7 h-7 text-primary" />
      </div>

      <h3 className="font-bold text-foreground mb-2">External Resource</h3>

      <p className="text-sm text-slate-400 mb-5">
        This material is available at an external link.
      </p>

      <a
        href={material.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold"
      >
        <ExternalLink className="w-4 h-4" />
        Open Resource
      </a>
    </div>
  );
}
