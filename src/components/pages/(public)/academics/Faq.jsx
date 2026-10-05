import React from "react";
import { SectionHeader } from "@/components/common/public/SectionHeader";
import { FaqAccordion } from "@/components/common/public/FaqAccordion";

export function Faq() {
  const faqs = [
    {
      q: "How are students assessed throughout the year?",
      a: "We follow a continuous evaluation model combining formative assessments (projects, quizzes, class participation) with summative board-pattern exams, all tracked in real-time through the EduSphere ERP.",
    },
    {
      q: "When do students choose their Senior Secondary stream?",
      a: "Stream selection happens at the end of Grade 8, guided by an aptitude assessment and one-on-one counseling sessions with our academic advisors.",
    },
    {
      q: "Are extracurriculars integrated into the academic day?",
      a: "Yes — fine arts, physical education, and coding/robotics modules are built directly into the timetable rather than offered only after school hours.",
    },
    {
      q: "Can students switch streams after Grade 9?",
      a: "Stream switches are evaluated case-by-case with our counseling team, typically only feasible before the start of Grade 10 board preparation.",
    },
  ];

  return (
    <section className="py-16 md:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Common Questions" title="Academics FAQ" maxWidthClassName="max-w-full" className="mb-10" />
      <FaqAccordion items={faqs} defaultOpenIndex={0} />
    </section>
  );
}
