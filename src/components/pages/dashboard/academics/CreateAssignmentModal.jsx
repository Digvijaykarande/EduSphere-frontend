"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  Plus,
  Paperclip,
  File,
  Image as ImageIcon,
  FileText,
  Loader2,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function fileIconFor(file) {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type === "application/pdf") return FileText;
  return File;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateAssignmentModal({ onClose, onCreate }) {
  const [myAssignments, setMyAssignments] = useState([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [sectionId, setSectionId] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingContext(true);
      setLoadError("");
      try {
        const res = await api.getMyAssignments();
        if (!cancelled) setMyAssignments(res.data?.assignments || []);
      } catch (err) {
        if (!cancelled)
          setLoadError(
            err instanceof ApiError
              ? err.message
              : "Failed to load your classes."
          );
      } finally {
        if (!cancelled) setLoadingContext(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sectionOptions = useMemo(() => {
    const seen = new Map();
    for (const a of myAssignments) {
      const sec = a.sectionId;
      if (sec && !seen.has(sec._id)) {
        seen.set(sec._id, {
          value: sec._id,
          label: `${sec.gradeClass} - ${sec.section}`,
        });
      }
    }
    return Array.from(seen.values());
  }, [myAssignments]);

  const subjectOptions = useMemo(() => {
    const match = myAssignments.find((a) => a.sectionId?._id === sectionId);
    return match ? match.subjects.map((s) => ({ value: s, label: s })) : [];
  }, [myAssignments, sectionId]);

  useEffect(() => {
    if (!sectionId && sectionOptions.length > 0)
      setSectionId(sectionOptions[0].value);
  }, [sectionOptions, sectionId]);

  useEffect(() => {
    if (
      subjectOptions.length > 0 &&
      !subjectOptions.some((o) => o.value === subject)
    ) {
      setSubject(subjectOptions[0].value);
    }
  }, [subjectOptions, subject]);

  const handleFilesSelected = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionId || !subject) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      let uploadedAttachments = [];
      if (attachments.length > 0) {
        setUploading(true);
        const res = await api.uploadFiles(
          attachments.map((a) => a.file),
          "assignment"
        );
        uploadedAttachments = res.data?.attachments || [];
        setUploading(false);
      }

      const res = await api.createHomeworkAssignment({
        sectionId,
        subject,
        title,
        description,
        dueDate,
        attachments: uploadedAttachments,
      });

      onCreate(res.data?.assignment);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Failed to create assignment."
      );
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent maxWidth="max-w-md">
        <ModalHeader>
          <ModalTitle>Assign New Homework / Task</ModalTitle>
        </ModalHeader>

        {loadingContext ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading your classes…
          </div>
        ) : loadError ? (
          <p className="text-sm text-rose-500 py-6">{loadError}</p>
        ) : sectionOptions.length === 0 ? (
          <p className="text-sm text-slate-400 py-6">
            You haven't been assigned to any class yet. Contact your school administrator.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="asg-title">Assignment title</Label>
              <Input
                id="asg-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Organic Chemistry Worksheet 3"
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
                <Label>Subject</Label>
                <Select
                  value={subject}
                  onValueChange={setSubject}
                  disabled={subjectOptions.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Label htmlFor="asg-desc">
                Instructions <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Textarea
                id="asg-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the task..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asg-due">Due date</Label>
              <Input
                id="asg-due"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Attach documents <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                onChange={(e) => {
                  if (e.target.files?.length)
                    handleFilesSelected(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary bg-slate-50/40 dark:bg-slate-800/20 hover:bg-primary/5 transition-all py-4 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-primary">Click to attach files</span>
                <span className="text-[10px] text-slate-400">
                  Images, PDFs, docs & more — uploaded to Cloudinary
                </span>
              </button>

              {attachments.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {attachments.map((a) => {
                    const Icon = fileIconFor(a.file);
                    return (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                          <span
                            className="text-xs font-semibold text-foreground truncate"
                            title={a.file.name}
                          >
                            {a.file.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatFileSize(a.file.size)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(a.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-all shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {submitError && (
              <p className="text-xs font-semibold text-rose-500">
                {submitError}
              </p>
            )}

            <ModalFooter>
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !sectionId || !subject}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <Plus className="w-4 h-4 mr-1.5" />
                )}
                <span>
                  {uploading
                    ? "Uploading…"
                    : submitting
                    ? "Saving…"
                    : "Assign task"}
                </span>
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
