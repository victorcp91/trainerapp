import React, { useState, useEffect } from "react";
import { Modal, Stack, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";

interface ReplicateTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void; // Pass dates back on confirm
}

const ReplicateTrainingModal: React.FC<ReplicateTrainingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Reset dates when modal opens
  useEffect(() => {
    if (isOpen) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
    } else {
      // Optional: Add user feedback (e.g., Mantine notification) if dates are missing
      alert("Por favor, preencha ambas as datas.");
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Replicar Série">
      <Stack>
        <DateInput
          label="Data de Início"
          placeholder="Selecione a data de início"
          value={startDate}
          onChange={setStartDate}
          clearable
          required
        />
        <DateInput
          label="Data de Expiração"
          placeholder="Selecione a data de expiração"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate || undefined} // Prevent end date before start date
          clearable
          required
        />
        <Button
          onClick={handleConfirm}
          variant="filled"
          color="blue"
          disabled={!startDate || !endDate} // Disable confirm if dates are missing
        >
          Confirmar
        </Button>
      </Stack>
    </Modal>
  );
};

export default ReplicateTrainingModal;
