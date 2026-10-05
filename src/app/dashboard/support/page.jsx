"use client";

import React, { useMemo, useState } from "react";
import SupportHeader from "@/components/pages/dashboard/support/SupportHeader";
import SupportFilters from "@/components/pages/dashboard/support/SupportFilters";
import TicketList from "@/components/pages/dashboard/support/TicketList";
import TicketDetail from "@/components/pages/dashboard/support/TicketDetail";
import CreateTicketModal from "@/components/pages/dashboard/support/CreateTicketModal";
import {
  STATUS_LIST,
  PRIORITY_LIST,
  PRIORITY_ORDER,
  seedTickets,
  emptyDraft,
} from "@/components/pages/dashboard/support/support.utils";

export default function SupportPage() {
  const [tickets, setTickets] = useState(seedTickets);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [activePriorities, setActivePriorities] = useState(
    Object.fromEntries(PRIORITY_LIST.map((p) => [p, true])),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(seedTickets[0].id);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [replyText, setReplyText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(1);

  const tabCounts = useMemo(() => {
    const counts = { All: tickets.length };
    STATUS_LIST.forEach(
      (s) => (counts[s] = tickets.filter((t) => t.status === s).length),
    );
    return counts;
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let list = tickets.filter((t) => activePriorities[t.priority]);
    if (activeTab !== "All") list = list.filter((t) => t.status === activeTab);
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.requester.name.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "Newest") return a.minutesAgo - b.minutesAgo;
      if (sortBy === "Oldest") return b.minutesAgo - a.minutesAgo;
      if (sortBy === "Priority")
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return 0;
    });
    return list;
  }, [tickets, activeTab, searchTerm, sortBy, activePriorities]);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedId) || null,
    [tickets, selectedId],
  );

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const pagedTickets = filteredTickets.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function togglePriority(p) {
    setActivePriorities((prev) => ({ ...prev, [p]: !prev[p] }));
  }
  function selectTicket(id) {
    setSelectedId(id);
    setOpenMenuId(null);
  }
  function updateTicketStatus(id, status) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setOpenMenuId(null);
  }
  function deleteTicket(id) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
    setOpenMenuId(null);
  }

  function handleCreateTicket(e) {
    e.preventDefault();
    if (!draft.subject.trim() || !draft.requesterName.trim()) return;
    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      subject: draft.subject.trim(),
      description: draft.description.trim() || "No description provided.",
      requester: {
        name: draft.requesterName.trim(),
        role: draft.requesterRole,
      },
      category: draft.category,
      priority: draft.priority,
      status: "Open",
      minutesAgo: 0,
      assignedTo: "Unassigned",
      attachments: [],
      conversation: [
        {
          author: draft.requesterName.trim(),
          time: "Just now",
          text: draft.description.trim() || "No description provided.",
          self: false,
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    setSelectedId(newId);
    setActiveTab("All");
    setPage(1);
    setDraft(emptyDraft);
    setCreateOpen(false);
  }

  function handleSendReply(e) {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: t.status === "Open" ? "In Progress" : t.status,
              conversation: [
                ...t.conversation,
                {
                  author: "You",
                  time: "Just now",
                  text: replyText.trim(),
                  self: true,
                },
              ],
            }
          : t,
      ),
    );
    setReplyText("");
  }

  return (
    <div className="max-w-[1500px] mx-auto pb-4">
      <SupportHeader setCreateOpen={setCreateOpen} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* Left Side: Tickets List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
          <SupportFilters
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setPage={setPage}
            tabCounts={tabCounts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            activePriorities={activePriorities}
            togglePriority={togglePriority}
          />
          <TicketList
            pagedTickets={pagedTickets}
            filteredTickets={filteredTickets}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            totalPages={totalPages}
            selectedId={selectedId}
            selectTicket={selectTicket}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            updateTicketStatus={updateTicketStatus}
            deleteTicket={deleteTicket}
          />
        </div>

        {/* Right Side: Ticket Details Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 xl:sticky xl:top-6 flex flex-col h-[650px] xl:h-[calc(100vh-6rem)]">
          <TicketDetail
            selectedTicket={selectedTicket}
            setSelectedId={setSelectedId}
            setTickets={setTickets}
            handleSendReply={handleSendReply}
            replyText={replyText}
            setReplyText={setReplyText}
          />
        </div>
      </div>

      <CreateTicketModal
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        draft={draft}
        setDraft={setDraft}
        handleCreateTicket={handleCreateTicket}
      />
    </div>
  );
}
