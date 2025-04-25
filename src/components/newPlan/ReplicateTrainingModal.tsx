import { Modal, Group, Stack, Button, Text, Divider } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface ReplicateTrainingModalProps {
  opened: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  selectedDay: Date | null; // The day being replicated
  onConfirm: (option: string | null, dates: Date[]) => void;
  handleReplicateWeek: (startDate: Date, replicateToEnd: boolean) => void;
}

export function ReplicateTrainingModal({
  opened,
  onClose,
  startDate,
  endDate,
  selectedDay,
  onConfirm,
}: ReplicateTrainingModalProps) {
  const t = useTranslations();
  const [internalOption, setInternalOption] = useState<string | null>(null);
  const [internalDates, setInternalDates] = useState<Date[]>([]);

  useEffect(() => {
    if (opened) {
      setInternalOption(null);
      setInternalDates([]);
    }
  }, [opened]);

  const handleConfirmClick = () => {
    onConfirm(internalOption, internalDates);
  };

  const predefinedOptions = [
    t("newPlan.replicateTrainingModal.every2Days"),
    t("newPlan.replicateTrainingModal.every3Days"),
    t("newPlan.replicateTrainingModal.every4Days"),
    t("newPlan.replicateTrainingModal.every5Days"),
    t("newPlan.replicateTrainingModal.every6Days"),
    t("newPlan.replicateTrainingModal.everyWeek"),
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("newPlan.replicateTrainingModal.title")}
      closeOnClickOutside
    >
      <Group>
        <Stack>
          <Group style={{ flexWrap: "wrap" }}>
            {predefinedOptions.map((label, index) => (
              <Button
                key={index}
                variant={internalOption === label ? "filled" : "outline"}
                c={internalOption === label ? "violet" : "gray"}
                onClick={() => setInternalOption(label)}
                style={{ flex: "1 1 calc(33.33% - 10px)", margin: "5px" }}
              >
                {label}
              </Button>
            ))}
          </Group>
          <Text size="sm" c="dimmed">
            {t("newPlan.replicateTrainingModal.description")}
          </Text>
        </Stack>
        {startDate && endDate ? (
          <Calendar
            locale="pt-BR"
            minDate={startDate}
            maxDate={endDate}
            value={internalDates}
            onChange={setInternalDates}
            multiple
            renderDay={(date) => {
              const day = date.getDate();
              const isSelected = internalDates.some(
                (d: Date) => d.toDateString() === date.toDateString()
              );
              const isOriginalDay =
                selectedDay &&
                selectedDay.toDateString() === date.toDateString();
              return (
                <div
                  style={{
                    backgroundColor: isSelected ? "#4caf50" : undefined,
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
            getDayProps={(date) => ({
              disabled: selectedDay?.toDateString() === date.toDateString(),
            })}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Defina as datas de início e expiração para replicação.
          </Text>
        )}
      </Group>
      <Divider my="sm" />
      <Button
        variant="filled"
        c="green"
        fullWidth
        mt="md"
        onClick={handleConfirmClick}
        disabled={
          !selectedDay || (!internalOption && internalDates.length === 0)
        }
      >
        {t("newPlan.replicateTrainingModal.confirmButton")}
      </Button>
    </Modal>
  );
}
