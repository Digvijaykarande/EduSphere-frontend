"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({
  open,
  title = "Delete account",
  description = "This action can't be undone.",
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal isOpen={open} onClose={loading ? () => {} : onCancel}>
      <ModalContent maxWidth="max-w-sm">
        <ModalHeader>
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
          </div>
        </ModalHeader>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 size={13} className="animate-spin mr-1.5" /> : null}
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
