import React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/dashboard/PageHeader";
import { PillButton } from "@/components/common/dashboard/PillButton";

export default function SupportHeader({ setCreateOpen }) {
  return (
    <PageHeader
      title="Support & Tickets"
      subtitle="Manage user issues, respond to tickets, and monitor SLA performance."
      actions={
        <PillButton
          icon={Plus}
          onClick={() => setCreateOpen(true)}
          className="shrink-0 w-full md:w-auto justify-center"
          style={{ background: "lab(40 29.66 -62.04)" }}
        >
          Create Ticket
        </PillButton>
      }
    />
  );
}