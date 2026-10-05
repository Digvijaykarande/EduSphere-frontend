"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Calendar, FileText, Send, User, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function StudentLeaveForm() {
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success"
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    dateFrom: "",
    dateTo: "",
    reason: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.studentName.trim() ||
      !formData.rollNo.trim() ||
      !formData.dateFrom ||
      !formData.dateTo ||
      !formData.reason.trim()
    ) {
      return;
    }
    
    setStatus("submitting");
    
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  const handleReset = () => {
    setFormData({ studentName: "", rollNo: "", dateFrom: "", dateTo: "", reason: "" });
    setStatus("idle");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 flex flex-col h-full relative overflow-hidden">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Leave Application</h3>
      
      <div className="relative flex-1 flex flex-col justify-center min-h-[325px]">
        <AnimatePresence mode="wait">
          {status !== "success" && (
            <motion.form 
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="st-name" className="text-[10px] uppercase font-bold text-slate-400">
                    Student Name
                  </Label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="st-name"
                      type="text" 
                      required
                      disabled={status === "submitting"}
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      placeholder="Full Name" 
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="st-roll" className="text-[10px] uppercase font-bold text-slate-400">
                    Roll No
                  </Label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      id="st-roll"
                      type="text" 
                      required
                      disabled={status === "submitting"}
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                      placeholder="e.g. 101" 
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="st-from" className="text-[10px] uppercase font-bold text-slate-400">
                    Date From
                  </Label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input 
                      id="st-from"
                      type="date" 
                      required
                      disabled={status === "submitting"}
                      value={formData.dateFrom}
                      onChange={(e) => setFormData({...formData, dateFrom: e.target.value})}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="st-to" className="text-[10px] uppercase font-bold text-slate-400">
                    Date To
                  </Label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input 
                      id="st-to"
                      type="date" 
                      required
                      disabled={status === "submitting"}
                      value={formData.dateTo}
                      onChange={(e) => setFormData({...formData, dateTo: e.target.value})}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="st-reason" className="text-[10px] uppercase font-bold text-slate-400">
                  Reason
                </Label>
                <div className="relative">
                  <FileText size={14} className="absolute left-3 top-3 text-slate-400" />
                  <Textarea 
                    id="st-reason"
                    rows={3} 
                    required
                    disabled={status === "submitting"}
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Brief explanation..." 
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700"
              >
                {status === "submitting" ? (
                  <><Loader2 size={16} className="animate-spin mr-1.5" /> Submitting...</>
                ) : (
                  <><Send size={15} className="mr-1.5" /> Submit Request</>
                )}
              </Button>
            </motion.form>
          )}

          {status === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm"
              >
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </motion.div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                Request Submitted
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mb-6">
                Your leave application has been sent to your class teacher for approval.
              </p>
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleReset}
              >
                Submit Another Request
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}