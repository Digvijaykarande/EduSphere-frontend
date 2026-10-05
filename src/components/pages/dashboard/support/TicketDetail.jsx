import React from "react";
import { MessageSquare, X, User, Mail, Phone, Paperclip, Send } from "lucide-react";
import { PRIORITY_META, STATUS_META, STAFF_LIST } from "./support.utils";

export default function TicketDetail({
  selectedTicket,
  setSelectedId,
  setTickets,
  handleSendReply,
  replyText,
  setReplyText,
}) {
  if (!selectedTicket) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          Select a ticket to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {selectedTicket.id}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${PRIORITY_META[selectedTicket.priority].badge}`}>
            {selectedTicket.priority.toUpperCase()}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${STATUS_META[selectedTicket.status].badge}`}>
            {selectedTicket.status.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setSelectedId(null)}
          className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <h2 className="text-lg font-display font-bold text-foreground leading-tight mt-3 shrink-0">
        {selectedTicket.subject}
      </h2>

      {/* Scrollable body: requester, meta, description, attachments, conversation */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-4 pr-1">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {selectedTicket.requester.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{selectedTicket.requester.role}</p>
          </div>
          <button className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Mail size={16} />
          </button>
          <button className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Phone size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Category</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedTicket.category}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Assigned To</p>
            <select
              value={selectedTicket.assignedTo}
              onChange={(e) =>
                setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? { ...t, assignedTo: e.target.value } : t)))
              }
              className="dash-focus w-full text-xs font-semibold text-slate-700 dark:text-slate-300 bg-transparent border-0 p-0 cursor-pointer focus:ring-0 cursor-pointer"
            >
              {STAFF_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="py-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">Description</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {selectedTicket.description}
          </p>
        </div>

        {selectedTicket.attachments.length > 0 && (
          <div className="py-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
              Attachments ({selectedTicket.attachments.length})
            </p>
            <div className="space-y-2">
              {selectedTicket.attachments.map((a) => (
                <div key={a.name} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <Paperclip className="h-4 w-4 text-slate-400 shrink-0 cursor-pointer" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{a.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{a.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="py-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">Conversation</p>
          <div className="space-y-3">
            {selectedTicket.conversation.map((m, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl text-xs ${m.self ? "bg-primary/10 dark:bg-primary/15 ml-6" : "bg-slate-50 dark:bg-slate-800/60 mr-6"}`}>
                <p className="font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  {m.author}
                  <span className="font-normal text-[10px] text-slate-400">{m.time}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reply box */}
      <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply here..."
          rows={2}
          className="dash-focus w-full bg-[#f5f6fb] dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-xs placeholder:text-slate-400 text-slate-700 dark:text-slate-200 resize-none"
        />
        <div className="flex items-center justify-between mt-2.5">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer">
            <Paperclip size={16} />
          </button>
          <button type="submit" className="btn-pill-primary !px-5 !py-2.5 text-xs gap-2 cursor-pointer" style={{background:"#6d5ef8"}}>
            <Send size={14} /> Send Reply
          </button>
        </div>
      </form>
    </div>
  );
}