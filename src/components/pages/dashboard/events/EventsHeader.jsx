import React from "react";
import { Plus, Download } from "lucide-react";
import { PageHeader } from "@/components/common/dashboard/PageHeader";
import { PillButton } from "@/components/common/dashboard/PillButton";

export default function EventsHeader({
  exportEvents,
  openModal,
  selectedDate,
  canManage,
}) {
  return (
    <PageHeader
      title="Events"
      subtitle={
        <>
          Dashboard <span className="mx-1">›</span> Events
        </>
      }
      actions={
        <>
          <PillButton variant="outline" icon={Download} onClick={exportEvents}>
            Export Events
          </PillButton>
          {canManage && (
            <PillButton
              icon={Plus}
              onClick={() => openModal(selectedDate)}
              style={{ background: "lab(45 18.62 -63.04)" }}
            >
              Create Event
            </PillButton>
          )}
        </>
      }
    />
  );
}
