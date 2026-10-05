"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DigitalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <Card className="bg-white p-6 sm:p-10 lg:p-12 rounded-[2rem] border border-slate-200/80 shadow-xl shadow-slate-200/30 text-card-foreground">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-extrabold text-slate-900">Send a Digital Inquiry</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed">
              Fill out the form below and the respective department will get back to you within 24 working hours.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center flex flex-col items-center justify-center"
            >
              <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="font-display text-xl font-bold text-slate-900">Message Dispatched!</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto">
                Your inquiry has been successfully routed. A representative will contact you via email or phone shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">First Name</label>
                  <Input type="text" required placeholder="John" className="bg-slate-50 border-slate-200 focus:bg-white h-10 text-xs sm:text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Last Name</label>
                  <Input type="text" required placeholder="Doe" className="bg-slate-50 border-slate-200 focus:bg-white h-10 text-xs sm:text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                  <Input type="email" required placeholder="john@example.com" className="bg-slate-50 border-slate-200 focus:bg-white h-10 text-xs sm:text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <Input type="tel" required placeholder="+91 98765 43210" className="bg-slate-50 border-slate-200 focus:bg-white h-10 text-xs sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Inquiry Type</label>
                <div className="relative">
                  {/* FIXED: Changed to use defaultValue instead of selected on option */}
                  <select 
                    required 
                    defaultValue="" 
                    className="w-full flex h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs sm:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus:border-blue-600 appearance-none cursor-pointer focus:bg-white"
                  >
                    <option value="" disabled>Select the nature of your inquiry...</option>
                    <option value="admissions">New Admissions (2026-2027)</option>
                    <option value="fees">Fee Payments & Finance</option>
                    <option value="tech">ERP / Portal Technical Support</option>
                    <option value="careers">Career Opportunities</option>
                    <option value="other">General Inquiry</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Detailed Message</label>
                <textarea required rows={4} placeholder="Please provide specific details so we can route this to the right desk..." className="w-full flex rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus:border-blue-600 resize-none focus:bg-white" />
              </div>

              <div className="pt-2 flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto gap-2 bg-[#3454d1] hover:bg-blue-600 text-white text-xs font-bold px-8 py-3.5 shadow-md border-none cursor-pointer rounded-xl transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Transmitting...
                    </span>
                  ) : (
                    <>Dispatch Inquiry <Send className="h-3.5 w-3.5 ml-1" /></>
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </motion.div>
    </section>
  );
}