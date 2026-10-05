"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqs = [
  { q: "What is the age criteria for primary school admission?", a: "For Grade 1, the child must have completed 6 years of age by December 31st of the academic year. This is strictly adhered to as per educational board guidelines." },
  { q: "Do you offer campus tours before applying?", a: "Yes, we offer guided campus tours every Saturday morning. You can book a slot through our Contact page. We highly recommend visiting to see our facilities firsthand." },
  { q: "Is the application fee refundable?", a: "The standard application processing fee (₹1,500) is non-refundable. However, any term tuition fees paid are subject to our standard withdrawal policy." },
  { q: "How long does the assessment process take?", a: "The interactive assessment usually lasts 45 minutes to an hour. It is not a formal written exam, but rather a behavioral and foundational aptitude check." },
];

export default function AdmissionFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c99a3f]">Got Questions?</span>
          <h3 className="font-display text-3xl font-extrabold text-slate-900 mt-2">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card 
              key={idx} 
              className={`border rounded-2xl transition-all duration-300 overflow-hidden shadow-none text-card-foreground ${
                openFaq === idx ? "border-[#3454d1] bg-blue-50/20" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${openFaq === idx ? "text-[#3454d1]" : "text-slate-400"}`} />
                  <h4 className={`text-sm sm:text-base font-bold transition-colors ${openFaq === idx ? "text-[#3454d1]" : "text-slate-900"}`}>
                    {faq.q}
                  </h4>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === idx ? "rotate-180 text-[#3454d1]" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 pl-14 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Still have questions? <Link href="/contact" className="text-[#3454d1] font-bold hover:underline">Reach out to the Helpdesk.</Link>
          </p>
        </div>
      </div>
    </section>
  );
}