import { Modal, Group, Stack, Button, Text, Divider } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useState, useEffect } from "react";

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
    "A cada 2 dias",
    "A cada 3 dias",
    "A cada 4 dias",
    "A cada 5 dias",
    "A cada 6 dias",
    "Toda semana",
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Replicar Treino"
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
            Selecione uma opção pré-definida ou use o calendário ao lado.
          </Text>
        </Stack>
        {startDate && endDate ? (
          <Calendar
            locale="pt-BR"
            minDate={startDate}
            maxDate={endDate}
            value={internalDates}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={setInternalDates as any}
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
        Confirmar Replicação
      </Button>
    </Modal>
  );
}
