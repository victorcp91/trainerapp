import React from "react";
import { Modal, Text, Button, Group, Stack } from "@mantine/core";

interface IntervalDetails {
  clientName: string;
  start: string;
  end: string;
}

interface ConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  intervalDetails: IntervalDetails | null;
  t: (key: string, params?: Record<string, React.ReactNode>) => string;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  intervalDetails,
  t,
}) => {
  if (!intervalDetails) {
    return null; // Don't render if details are missing
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("scheduleModal.confirmCancelTitle")}
      centered
      size="sm"
    >
      <Stack>
        <Text size="sm">
          {t("scheduleModal.confirmCancelText", {
            clientName: intervalDetails.clientName,
            start: intervalDetails.start,
            end: intervalDetails.end,
          })}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {t("scheduleModal.confirmCancelCancel")}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {t("scheduleModal.confirmCancelConfirm")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmCancelModal;
