"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AcademicStructure from "./AcademicStructure";
import ClassSubjectMaintenance from "./ClassSubjectMaintenance";
import TeacherAllocation from "./TeacherAllocation";
import CreateClassModal from "./CreateClassModal";
import AllocateTeacherModal from "./AllocateTeacherModal";

export default function PrincipalAcademics() {
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isAllocateTeacherOpen, setIsAllocateTeacherOpen] = useState(false);
  const [classRefreshKey, setClassRefreshKey] = useState(0);
  const [allocationRefreshKey, setAllocationRefreshKey] = useState(0);

  const handleCreateClass = () => {
    setIsCreateClassOpen(false);
    setClassRefreshKey((k) => k + 1);
  };

  const handleAllocateTeacher = () => {
    setIsAllocateTeacherOpen(false);
    setAllocationRefreshKey((k) => k + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <AcademicStructure />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <ClassSubjectMaintenance
            refreshKey={classRefreshKey}
            onNewClass={() => setIsCreateClassOpen(true)}
          />
        </div>
      </div>
      <TeacherAllocation refreshKey={allocationRefreshKey} onAllocateNew={() => setIsAllocateTeacherOpen(true)} />

      {isCreateClassOpen && (
        <CreateClassModal onClose={() => setIsCreateClassOpen(false)} onCreate={handleCreateClass} />
      )}

      {isAllocateTeacherOpen && (
        <AllocateTeacherModal onClose={() => setIsAllocateTeacherOpen(false)} onAllocate={handleAllocateTeacher} />
      )}
    </motion.div>
  );
}
