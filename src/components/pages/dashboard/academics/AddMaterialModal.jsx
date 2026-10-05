"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Loader2, Link as LinkIcon, Upload } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_OPTIONS = [
  { value: "pdf", label: "PDF Document" },
  { value: "video", label: "Video" },
  { value: "folder", label: "Folder (file)" },
  { value: "link", label: "External Link" },
];

export default function AddMaterialModal({ onClose, onCreate }) {
  const [myAssignments, setMyAssignments] = useState([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [sectionId, setSectionId] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("pdf");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getMyAssignments()
      .then((res) => {
        if (!cancelled) setMyAssignments(res.data?.assignments || []);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load your classes.");
      })
      .finally(() => !cancelled && setLoadingContext(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const sectionOptions = (() => {
    const seen = new Map();
    for (const a of myAssignments) {
      const sec = a.sectionId;
      if (sec && !seen.has(sec._id)) seen.set(sec._id, { value: sec._id, label: `${sec.gradeClass} - ${sec.section}` });
    }
    return Array.from(seen.values());
  })();

  const subjectOptions = (() => {
    const match = myAssignments.find((a) => a.sectionId?._id === sectionId);
    return match ? match.subjects.map((s) => ({ value: s, label: s })) : [];
  })();

  useEffect(() => {
    if (!sectionId && sectionOptions.length > 0) setSectionId(sectionOptions[0].value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAssignments]);

  const isFileType = type !== "link";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionId) return;
    if (isFileType && !file) {
      setError("Please choose a file to upload.");
      return;
    }
    if (!isFileType && !linkUrl.trim()) {
      setError("Please provide a link URL.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      let url = linkUrl.trim();
      let fileSize = 0;

      if (isFileType) {
        setUploading(true);
        const res = await api.uploadFiles([file], "assignment");
        const uploaded = res.data?.attachments?.[0];
        if (!uploaded) throw new Error("Upload returned no file");
        url = uploaded.url;
        fileSize = uploaded.size;
        setUploading(false);
      }

      const res = await api.createStudyMaterial({
        sectionId,
        subject,
        title,
        type,
        url,
        fileSize,
      });
      onCreate(res.data?.material);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add material.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent maxWidth="max-w-md">
        <ModalHeader>
          <ModalTitle>Add Study Material</ModalTitle>
        </ModalHeader>

        {loadingContext ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading your classes…
          </div>
        ) : loadError ? (
          <p className="text-sm text-rose-500 py-6">{loadError}</p>
        ) : sectionOptions.length === 0 ? (
          <p className="text-sm text-slate-400 py-6">You haven't been assigned to any class yet.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="mat-title">Title</Label>
              <Input
                id="mat-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 4 Notes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Class & Section</Label>
                <Select value={sectionId} onValueChange={setSectionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Subject (optional)</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="General" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General</SelectItem>
                    {subjectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isFileType ? (
              <div className="space-y-1.5">
                <Label>File</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary bg-slate-50/40 dark:bg-slate-800/20 hover:bg-primary/5 transition-all py-5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-primary">{file ? file.name : "Click to select a file"}</span>
                  <span className="text-[10px] text-slate-400">Uploaded to Cloudinary, compressed automatically</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="mat-link">Link URL</Label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="mat-link"
                    type="url"
                    required
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

            <ModalFooter>
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !sectionId}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <Plus className="w-4 h-4 mr-1.5" />
                )}
                <span>{uploading ? "Uploading…" : submitting ? "Saving…" : "Add material"}</span>
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
