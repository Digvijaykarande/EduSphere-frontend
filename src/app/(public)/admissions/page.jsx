"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/common/dashboard/PageTransition";
import { 
  ClipboardCheck, 
  FileText, 
  UserCheck, 
  CreditCard, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  Download,
  AlertCircle,
  ChevronDown,
  GraduationCap,
  Users
} from "lucide-react";

export default function AdmissionsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const steps = [
    { 
      title: "Online Inquiry & Registration", 
      desc: "Fill out the preliminary digital registry data. Our admissions team will generate a unique application tracking ID for your ward.",
      icon: ClipboardCheck,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    { 
      title: "Digital Document Verification", 
      desc: "Securely upload birth certificates, previous academic term reports, and local identification criteria via our encrypted portal.",
      icon: FileText,
      color: "text-amber-600 bg-amber-50 border-amber-200"
    },
    { 
      title: "Interactive Assessment", 
      desc: "A brief baseline screening evaluation and a relaxed interaction session with our counseling faculties to understand the student's aptitude.",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    { 
      title: "Fee Settlement & Finalization", 
      desc: "Upon selection, secure the allocated seat through term fee confirmation using our automated payment gateway.",
      icon: CreditCard,
      color: "text-purple-600 bg-purple-50 border-purple-200"
    },
  ];

  const dates = [
    { event: "Applications Open", date: "August 15, 2026", status: "Active", desc: "Portal opens for new digital registrations." },
    { event: "Document Deadline", date: "September 30, 2026", status: "Upcoming", desc: "Last day to upload required KYC documents." },
    { event: "Assessment Week", date: "Oct 10 - Oct 15, 2026", status: "Pending", desc: "On-campus student interactions & faculty reviews." },
    { event: "First Merit List", date: "November 01, 2026", status: "Pending", desc: "Official publication of selected candidates." },
  ];

  const documents = [
    "Original Birth Certificate (Issued by Municipal Corporation)",
    "Aadhar Card or Valid Passport of Student & Parents",
    "Previous Academic Year Marksheets (Grade 2 onwards)",
    "School Leaving / Transfer Certificate (Original)",
    "Recent Passport Size Photographs (Student & Parents)",
    "Medical Fitness & Blood Group Certificate"
  ];

  const faqs = [
    { q: "What is the age criteria for primary school admission?", a: "For Grade 1, the child must have completed 6 years of age by December 31st of the academic year. This is strictly adhered to as per educational board guidelines." },
    { q: "Do you offer campus tours before applying?", a: "Yes, we offer guided campus tours every Saturday morning. You can book a slot through our Contact page. We highly recommend visiting to see our facilities firsthand." },
    { q: "Is the application fee refundable?", a: "The standard application processing fee (₹1,500) is non-refundable. However, any term tuition fees paid are subject to our standard withdrawal policy." },
    { q: "How long does the assessment process take?", a: "The interactive assessment usually lasts 45 minutes to an hour. It is not a formal written exam, but rather a behavioral and foundational aptitude check." },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2d]">
      <PageTransition>
        
        {/* ---------------- 1. HERO SECTION ---------------- */}
        <section className="bg-[#0b1226] text-white py-20 lg:py-32 relative overflow-hidden h-[90vh]">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#3454d1]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#c99a3f]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-[#c99a3f] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 shadow-inner"
            >
              Session 2026 - 2027
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight"
            >
              Begin Your Journey <br />
              <span className="text-[#3454d1] bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                With Everest
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Our admissions process is designed to be transparent, entirely digital, and merit-based. Join a global community of learners and innovators today.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/register">
                <button className="bg-[#3454d1] hover:bg-blue-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center gap-2">
                  Start Online Application <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>


        {/* ---------------- 2. INTERACTIVE DATES TIMELINE ---------------- */}
        <section className="py-24 bg-white border-b border-slate-200/80 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3454d1]">Admissions Schedule</span>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">Important Deadlines</h2>
              <p className="text-xs text-slate-500 mt-2">Keep track of crucial dates to ensure a smooth enrollment process.</p>
            </div>

            {/* Horizontal Timeline */}
            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {dates.map((d, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -5 }}
                    className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Status Dot */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center ${
                      d.status === "Active" ? "bg-emerald-500" : d.status === "Upcoming" ? "bg-amber-400" : "bg-slate-300"
                    }`}>
                      {d.status === "Active" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                    </div>

                    <div className="text-center mt-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        d.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                        d.status === "Upcoming" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {d.status}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-4">{d.event}</h4>
                      <div className="flex items-center justify-center gap-1.5 text-sm font-mono font-bold text-[#3454d1] mt-2 mb-3 bg-blue-50/50 py-1.5 rounded-lg">
                        <Clock className="h-4 w-4 text-[#c99a3f]" />
                        {d.date}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ---------------- 3. ENROLLMENT PIPELINE ---------------- */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c99a3f]">Step-by-Step</span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">Enrollment Pipeline</h2>
            <p className="text-xs text-slate-500 mt-2">A streamlined 4-step process powered by our automated digital portal.</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#3454d1] before:to-[#c99a3f]">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.color}`}>
                      <span className="font-mono text-sm font-bold">{idx + 1}</span>
                    </div>
                  </div>
                  
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-2.5 rounded-xl ${step.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{step.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </section>


        {/* ---------------- 4. ELIGIBILITY (NEW SECTION) ---------------- */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c99a3f]">Eligibility Matrix</span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-snug">
                Who Can Apply?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We seek curious, motivated students who are eager to learn and grow. Admission is granted regardless of race, religion, or national origin, provided the student meets the fundamental age and academic requirements.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                  <span className="text-xs font-semibold">Grades 1 to 12</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs font-semibold">Co-Educational</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md w-full">
              <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Age Cut-offs (As of Dec 31st)</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Grade 1</span>
                  <span className="font-mono font-bold text-[#c99a3f]">6 Years</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Grade 5</span>
                  <span className="font-mono font-bold text-[#c99a3f]">10 Years</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Grade 9</span>
                  <span className="font-mono font-bold text-[#c99a3f]">14 Years</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Grade 11</span>
                  <span className="font-mono font-bold text-[#c99a3f]">16 Years</span>
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* ---------------- 5. REQUIRED DOCUMENTS (VERTICAL) ---------------- */}
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

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg">
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
            </div>
          </div>
        </section>


        {/* ---------------- 6. INTERACTIVE FAQ ACCORDION ---------------- */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c99a3f]">Got Questions?</span>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 mt-2">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    openFaq === idx ? "border-[#3454d1] shadow-md bg-blue-50/20" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${openFaq === idx ? "text-[#3454d1]" : "text-slate-400"}`} />
                      <h4 className={`text-sm sm:text-base font-bold transition-colors ${openFaq === idx ? "text-[#3454d1]" : "text-slate-900"}`}>
                        {faq.q}
                      </h4>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 cursor-pointer ${openFaq === idx ? "rotate-180 text-[#3454d1]" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 pl-14 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 mt-2 cursor-pointer">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                Still have questions? <Link href="/contact" className="text-[#3454d1] font-bold hover:underline cursor-pointer">Reach out to the Helpdesk.</Link>
              </p>
            </div>
          </div>
        </section>


        {/* ---------------- 7. BOTTOM CTA ---------------- */}
        <section className="py-20 bg-[#0f1a3a] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Ready to Submit Your Application?</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Access the digital portal to create your profile, upload your documents, and track your application status in real-time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link href="/register">
                <button className="bg-[#3454d1] hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-900/50 hover:-translate-y-1 cursor-pointer">
                  Create Applicant Account
                </button>
              </Link>
              <button className="border border-white/20 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 hover:-translate-y-1 cursor-pointer">
                <Download className="h-5 w-5" /> Download Prospectus
              </button>
            </div>
          </div>
        </section>

      </PageTransition>
    </div>
  );
}