"use client";

import { useState, useEffect, useCallback } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Landmark,
  Shapes,
  ChevronRight,
  Edit3,
  Save,
  X,
  Trash2,
  GripVertical,
  Layers,
  Users,
  BookOpen,
  Loader2,
  Plus,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

function WingIcon({ iconName }) {
  if (iconName === "building")
    return <Building2 className="w-5 h-5 text-primary" />;
  if (iconName === "landmark")
    return <Landmark className="w-5 h-5 text-success" />;
  return <Shapes className="w-5 h-5 text-violet-500" />;
}

export default function AcademicStructure() {
  const [isEditing, setIsEditing] = useState(false);
  const [wings, setWings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeWingId, setActiveWingId] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClassesLabel, setNewClassesLabel] = useState("");
  const [creating, setCreating] = useState(false);

  const loadWings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getWings();
      setWings(res.data?.wings || []);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load academic structure.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWings();
  }, [loadWings]);

  // Reorder handler for drag-and-drop — updates local state immediately for
  // a responsive drag, then persists the new order to the backend.
  const handleReorder = async (newOrder) => {
    setWings(newOrder);
    setSavingOrder(true);
    try {
      await api.reorderWings(newOrder.map((w) => w._id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to save new order.",
      );
      loadWings(); // revert to server truth on failure
    } finally {
      setSavingOrder(false);
    }
  };

  const handleWingChange = (id, field, value) => {
    setWings((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w)),
    );
  };

  const persistEdits = async () => {
    setIsEditing(false);
    try {
      await Promise.all(
        wings.map((w) =>
          api.updateWing(w.slug, {
            name: w.name,
            classesLabel: w.classesLabel,
          }),
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to save changes.",
      );
      loadWings();
    }
  };

  const handleDelete = async (id, slug) => {
    setWings((prev) => prev.filter((w) => w._id !== id));
    if (activeWingId === id) setActiveWingId(null);
    try {
      await api.deleteWing(slug);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to delete wing.",
      );
      loadWings();
    }
  };

  const handleCreateWing = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await api.createWing({
        name: newName.trim(),
        classesLabel: newClassesLabel.trim(),
      });
      setNewName("");
      setNewClassesLabel("");
      setIsAdding(false);
      await loadWings();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to create wing.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="dashboard-card p-6 space-y-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Academic Structure
            </h3>
            <p className="text-xs text-slate-400">
              {savingOrder
                ? "Saving order…"
                : "Drag to reorder wings, click to view details"}
            </p>
          </div>
          {!isEditing ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAdding((p) => !p)}
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={wings.length === 0}
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-40"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  loadWings();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={persistEdits}
                className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>

        {isAdding && (
          <form
            onSubmit={handleCreateWing}
            className="mb-4 p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2"
          >
            <input
              type="text"
              autoFocus
              required
              placeholder="Wing name (e.g. Primary Wing)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Classes label (e.g. Grades 1-5)"
              value={newClassesLabel}
              onChange={(e) => setNewClassesLabel(e.target.value)}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-primary"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Create wing
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <p className="text-sm text-rose-500 py-4">{error}</p>
        ) : wings.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">
            No academic wings created yet.
          </p>
        ) : (
          <Reorder.Group
            axis="y"
            values={wings}
            onReorder={handleReorder}
            className="space-y-3 mb-8"
          >
            {wings.map((wing) => (
              <Reorder.Item
                key={wing._id}
                value={wing}
                className="list-none"
                whileDrag={{
                  scale: 1.02,
                  boxShadow: "0 12px 28px -8px rgba(79,70,229,0.25)",
                }}
              >
                <div
                  className={`rounded-xl border transition-all group ${
                    isEditing
                      ? "border-primary/30 bg-primary/5"
                      : activeWingId === wing._id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm"
                  }`}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 w-full">
                      {isEditing && (
                        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing shrink-0" />
                      )}
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        <WingIcon iconName={wing.iconName} />
                      </div>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          !isEditing &&
                          setActiveWingId(
                            wing._id === activeWingId ? null : wing._id,
                          )
                        }
                      >
                        {isEditing ? (
                          <div className="space-y-2 w-full pr-4">
                            <input
                              type="text"
                              value={wing.name}
                              onChange={(e) =>
                                handleWingChange(
                                  wing._id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-primary"
                            />
                            <input
                              type="text"
                              value={wing.classesLabel}
                              onChange={(e) =>
                                handleWingChange(
                                  wing._id,
                                  "classesLabel",
                                  e.target.value,
                                )
                              }
                              className="w-full text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-primary"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                              {wing.name}
                            </h4>
                            <span className="text-xs text-slate-400 font-medium">
                              {wing.classesLabel}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(wing._id, wing.slug)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <ChevronRight
                        onClick={() =>
                          setActiveWingId(
                            wing._id === activeWingId ? null : wing._id,
                          )
                        }
                        className={`w-4 h-4 transition-all cursor-pointer shrink-0 ${
                          activeWingId === wing._id
                            ? "text-primary rotate-90"
                            : "text-slate-400 group-hover:text-primary group-hover:translate-x-0.5"
                        }`}
                      />
                    )}
                  </div>

                  <AnimatePresence>
                    {!isEditing && activeWingId === wing._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 grid grid-cols-3 gap-2">
                          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-center">
                            <Layers className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                            <p className="text-xs font-black text-foreground">
                              {wing.sectionsCount ?? "—"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">
                              Sections
                            </p>
                          </div>
                          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-center">
                            <Users className="w-3.5 h-3.5 text-success mx-auto mb-1" />
                            <p className="text-xs font-black text-foreground">
                              {wing.studentsCount ?? "—"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">
                              Students
                            </p>
                          </div>
                          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 text-center">
                            <BookOpen className="w-3.5 h-3.5 text-violet-500 mx-auto mb-1" />
                            <p className="text-xs font-black text-foreground">
                              {wing.subjectsCount ?? "—"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">
                              Subjects
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}
