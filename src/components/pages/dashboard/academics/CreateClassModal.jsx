"use client";

import { useState, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { api, ApiError } from "@/lib/api";
import { SUBJECTS } from "@/store/attendance.utils";
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

const CLASS_GRADES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTION_LETTERS = ["A", "B", "C", "D", "E"];
const ROOMS = ["R-101", "R-102", "R-103", "R-204", "R-205", "LAB-1", "LAB-2"];

export default function CreateClassModal({ onClose, onCreate }) {
  const [classNumber, setClassNumber] = useState(CLASS_GRADES[9]);
  const [section, setSection] = useState(SECTION_LETTERS[0]);
  const [room, setRoom] = useState(ROOMS[0]);
  const [seats, setSeats] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [classTeacherId, setClassTeacherId] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const maxSubjects = 16;
  const remaining = maxSubjects - selectedSubjects.length;

  useEffect(() => {
    let cancelled = false;
    api
      .getTeachers({ limit: 200 })
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.teachers || [];
        setTeachers(list);
        if (list.length > 0) setClassTeacherId(list[0]._id);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load teachers.");
      })
      .finally(() => !cancelled && setLoadingTeachers(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < maxSubjects) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classTeacherId) {
      setError("Select a class teacher — create a Teacher first if none exist.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await api.createSection({
        gradeClass: classNumber,
        section: `Section ${section}`,
        classTeacherId,
        room,
        seatCapacity: seats ? Number(seats) : undefined,
        subjects: selectedSubjects,
      });
      onCreate(res.data?.section);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create class section.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent maxWidth="max-w-md">
        <ModalHeader>
          <ModalTitle>Create New Class Section</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Class grade</Label>
              <Select value={classNumber} onValueChange={setClassNumber}>
                <SelectTrigger>
                  <SelectValue placeholder="Class grade" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_LETTERS.map((s) => (
                    <SelectItem key={s} value={s}>
                      Section {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Class teacher</Label>
            <Select
              value={classTeacherId}
              onValueChange={setClassTeacherId}
              disabled={loadingTeachers || teachers.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingTeachers ? "Loading..." : "Select teacher"} />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.firstName} {t.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Room number</Label>
              <Select value={room} onValueChange={setRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cls-seats">Seat capacity</Label>
              <Input
                id="cls-seats"
                type="number"
                min="1"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="e.g. 40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Subjects</Label>

            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                <AnimatePresence initial={false}>
                  {selectedSubjects.map((sub) => (
                    <motion.span
                      key={sub}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 bg-primary text-white text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-full"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mb-2">
              Click to add · {remaining} more subject{remaining === 1 ? "" : "s"} allowed
            </p>

            <div className="flex flex-wrap gap-2">
              {SUBJECTS.filter((s) => !selectedSubjects.includes(s)).map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  disabled={remaining === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  {subject} <Plus className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

          <ModalFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting || loadingTeachers}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Plus className="w-4 h-4 mr-1.5" />}
              <span>Create section</span>
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
