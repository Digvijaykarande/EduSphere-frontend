"use client";

import { useEffect, useMemo, useState } from "react";
import { Wallet, Clock3, Users2, TrendingUp } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { toRowShape, formatINR } from "./fees.utils";

// Owns all server data + filter state for the principal fees dashboard.
// FeesPage stays focused on layout; this hook is what actually talks to the
// API and derives the table rows / stat cards from it.
export function useFeesDashboard(role) {
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedFeeCategory, setSelectedFeeCategory] = useState("ALL");
  const [statusTab, setStatusTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [schoolClasses, setSchoolClasses] = useState({ sections: [], gradeClasses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      const [studentsRes, statsRes, classesRes] = await Promise.all([
        api.getSchoolFeeStudents({}),
        api.getSchoolFeeStats({}),
        api.getSchoolFeeClasses(),
      ]);
      setStudents(studentsRes.data.students.map(toRowShape));
      setStats(statsRes.data.stats);
      setSchoolClasses(classesRes.data);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load fees data.");
      return false;
    }
  };

  useEffect(() => {
    if (role !== "principal") return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const ok = await loadDashboard();
      if (!cancelled && ok) setError(null);
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const refetchDashboard = async () => {
    await loadDashboard();
  };

  // Real classes present in the school right now — from the Student roster,
  // not from fee ledgers (which may not exist yet for a brand-new class).
  const classOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Classes & Sections" },
      ...schoolClasses.sections.map((s) => ({
        value: s.class,
        label: `Class ${s.gradeClass} - ${s.section}`,
      })),
    ];
  }, [schoolClasses]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === "ALL" || s.class === selectedClass;
      const matchesStatus =
        statusTab === "ALL" ||
        s.status.toLowerCase().replace(" ", "") === statusTab.toLowerCase().replace(" ", "");
      const matchesFeeCategory =
        selectedFeeCategory === "ALL" ||
        s.breakdown.some((b) => b.particular.toLowerCase().includes(selectedFeeCategory.toLowerCase()));
      return matchesSearch && matchesClass && matchesStatus && matchesFeeCategory;
    });
  }, [students, searchTerm, selectedClass, statusTab, selectedFeeCategory]);

  const feeStatsPrincipal = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: "Collected Fees",
        value: formatINR(stats.totalCollected),
        change: `${stats.collectionRate}% of total billed`,
        trend: stats.collectionRate >= 50 ? "up" : "down",
        icon: Wallet,
        tone: "violet",
      },
      {
        label: "Pending Fees",
        value: formatINR(stats.totalPending),
        change: `${stats.statusBreakdown.Pending} students pending`,
        trend: stats.totalPending > 0 ? "down" : "up",
        icon: Clock3,
        tone: "orange",
      },
      {
        label: "Total Students",
        value: stats.totalStudents.toLocaleString("en-IN"),
        change: `${stats.statusBreakdown.Paid} fully paid`,
        trend: "up",
        icon: Users2,
        tone: "blue",
      },
      {
        label: "Collection Rate",
        value: `${stats.collectionRate}%`,
        change: stats.academicYear,
        trend: stats.collectionRate >= 75 ? "up" : "down",
        icon: TrendingUp,
        tone: "green",
      },
    ];
  }, [stats]);

  return {
    selectedClass,
    setSelectedClass,
    selectedFeeCategory,
    setSelectedFeeCategory,
    statusTab,
    setStatusTab,
    searchTerm,
    setSearchTerm,
    schoolClasses,
    loading,
    error,
    refetchDashboard,
    classOptions,
    filteredStudents,
    feeStatsPrincipal,
  };
}
