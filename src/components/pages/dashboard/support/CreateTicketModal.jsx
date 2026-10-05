"use client";

import React from "react";
import { CATEGORY_LIST, ROLE_LIST, PRIORITY_LIST } from "./support.utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateTicketModal({
  createOpen,
  setCreateOpen,
  draft,
  setDraft,
  handleCreateTicket,
}) {
  return (
    <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
      <ModalContent maxWidth="max-w-lg">
        <ModalHeader>
          <ModalTitle>Create New Ticket</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleCreateTicket} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="tk-subject">Subject</Label>
            <Input
              id="tk-subject"
              type="text"
              required
              value={draft.subject}
              onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
              placeholder="e.g. Unable to access exam results"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tk-desc">Description</Label>
            <Textarea
              id="tk-desc"
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tk-req">Requester Name</Label>
              <Input
                id="tk-req"
                type="text"
                required
                value={draft.requesterName}
                onChange={(e) => setDraft((d) => ({ ...d, requesterName: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={draft.requesterRole}
                onValueChange={(v) => setDraft((d) => ({ ...d, requesterRole: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_LIST.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft((d) => ({ ...d, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_LIST.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={draft.priority}
                onValueChange={(v) => setDraft((d) => ({ ...d, priority: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LIST.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Ticket
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}