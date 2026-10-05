"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const documents = [
  "Original Birth Certificate (Issued by Municipal Corporation)",
  "Aadhar Card or Valid Passport of Student & Parents",
  "Previous Academic Year Marksheets (Grade 2 onwards)",
  "School Leaving / Transfer Certificate (Original)",
  "Recent Passport Size Photographs (Student & Parents)",
  "Medical Fitness & Blood Group Certificate"
];

export default function RequiredDocuments() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-12 w-12 bg-blue-100 text-[#3454d1] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="font-display text-3xl font-extrabold text-slate-900">Required KYC Documents</h3>
          <p className="text-sm text-slate-500 mt-3 max-w-xl mx-auto">
            Please prepare high-quality digital scans (PDF/JPEG, max 5MB each) of the following documents before initiating the application process.
          </p>
        </div>

        <Card className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg text-card-foreground">
          <ul className="space-y-4">
            {documents.map((doc, i) => (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-slate-50 hover:bg-blue-50/50 transition-colors p-4 rounded-xl border border-slate-100"
              >
                <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{doc}</span>
              </motion.li>
            ))}
          </ul>
          
          <div className="mt-8 flex items-start gap-4 bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-800">
            <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              <strong>Important Notice:</strong> All uploaded documents must be clear and self-attested. Discrepancies in birth certificates or previous marksheets may lead to immediate cancellation of the application without refund.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}