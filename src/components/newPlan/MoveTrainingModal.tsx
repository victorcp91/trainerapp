import { Modal, Text, Divider, Button } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface MoveTrainingModalProps {
  opened: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  selectedDay: Date | null; // The day being moved
  onConfirm: (targetDate: Date) => void;
}

export function MoveTrainingModal({
  opened,
  onClose,
  startDate,
  endDate,
  selectedDay,
  onConfirm,
}: MoveTrainingModalProps) {
  const t = useTranslations();
  const [internalMoveTargetDate, setInternalMoveTargetDate] =
    useState<Date | null>(null);

  useEffect(() => {
    if (opened) {
      setInternalMoveTargetDate(null);
    }
  }, [opened]);

  const handleConfirmClick = () => {
    if (internalMoveTargetDate) {
      onConfirm(internalMoveTargetDate);
    }
  };

  const handleInternalClose = () => {
    setInternalMoveTargetDate(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleInternalClose}
      title={t("newPlan.moveTrainingModal.title")}
      closeOnClickOutside
    >
      <Text size="sm" mb="sm">
        {t("newPlan.moveTrainingModal.description")}
      </Text>
      {startDate && endDate ? (
        <Calendar
          locale="pt-BR"
          minDate={startDate}
          maxDate={endDate}
          value={internalMoveTargetDate}
          onChange={setInternalMoveTargetDate}
          renderDay={(date: Date) => {
            const day = date.getDate();
            const isSelected =
              internalMoveTargetDate &&
              internalMoveTargetDate.toDateString() === date.toDateString();
            const isOriginalDay =
              selectedDay && selectedDay.toDateString() === date.toDateString();
            return (
              <div
                style={{
                  backgroundColor: isSelected ? "#ff9800" : undefined,
                  color: isSelected
                    ? "white"
                    : isOriginalDay
                    ? "#adb5bd"
                    : "inherit",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isOriginalDay ? "not-allowed" : "pointer",
                }}
              >
                {day}
              </div>
            );
          }}
          getDayProps={(date: Date) => ({
            disabled: selectedDay?.toDateString() === date.toDateString(),
          })}
        />
      ) : (
        <Text size="sm" c="dimmed">
          Defina as datas de início e expiração para mover o treino.
        </Text>
      )}
      <Divider my="sm" />
      <Button
        variant="filled"
        c="orange"
        fullWidth
        mt="md"
        onClick={handleConfirmClick}
        disabled={
          !selectedDay ||
          !internalMoveTargetDate ||
          (selectedDay &&
            internalMoveTargetDate &&
            selectedDay.toDateString() ===
              internalMoveTargetDate.toDateString())
        }
      >
        {t("newPlan.moveTrainingModal.confirmButton")}
      </Button>
    </Modal>
  );
}
