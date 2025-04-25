import { Fragment } from "react";
import { Card, Text, Group, Stack, Divider, Button } from "@mantine/core";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Exercise } from "../../types/exercise"; // Use relative path
import { useTranslations } from "next-intl";

interface TrainingDay {
  date: Date;
  exercises: Exercise[];
}

interface TrainingDayCardProps {
  dayData: TrainingDay;
  index: number;
  isAvailableDay: boolean;
  trainingDays: TrainingDay[]; // Need the full array for week replication logic/disable state
  onReplicateClick: (date: Date) => void;
  onMoveClick: (date: Date) => void;
  onClearClick: (date: Date) => void;
  onAddModelClick: (date: Date) => void;
  onEditCreateClick: (date: Date) => void;
  onReplicateWeek: (startDate: Date, replicateToEnd: boolean) => void;
}

export function TrainingDayCard({
  dayData,
  index,
  isAvailableDay,
  trainingDays,
  onReplicateClick,
  onMoveClick,
  onClearClick,
  onAddModelClick,
  onEditCreateClick,
  onReplicateWeek,
}: TrainingDayCardProps) {
  const { date, exercises } = dayData;
  const isWeekEnd = (index + 1) % 7 === 0;
  const isLastDay = index === trainingDays.length - 1;
  const t = useTranslations();

  const canReplicateWeek = !trainingDays
    .slice(index - 6, index + 1)
    .every((day) => day.exercises.length === 0);

  return (
    <Fragment>
      {/* Day Card */}
      <Card
        shadow="sm"
        padding="lg"
        style={{
          border: isAvailableDay ? "2px solid #4caf50" : "1px solid #ccc",
          backgroundColor: isAvailableDay ? "#e8f5e9" : "white",
        }}
      >
        <Stack>
          {/* Header & Controls */}
          <Group align="center" justify="space-between">
            <Text size="md">{format(date, "EEEE", { locale: ptBR })}</Text>
            <Group>
              <Button
                variant="subtle"
                size="compact-xs"
                c="blue"
                onClick={() => onReplicateClick(date)}
                disabled={exercises.length === 0}
                style={
                  exercises.length === 0
                    ? { opacity: 0.5, pointerEvents: "none" }
                    : {}
                }
              >
                {t("newPlan.dayCard.replicateButton")}
              </Button>
              <Button
                variant="subtle"
                size="compact-xs"
                c="orange"
                onClick={() => onMoveClick(date)}
                disabled={exercises.length === 0}
                style={
                  exercises.length === 0
                    ? { opacity: 0.5, pointerEvents: "none" }
                    : {}
                }
              >
                {t("newPlan.dayCard.moveButton")}
              </Button>
              <Button
                variant="subtle"
                size="compact-xs"
                c="red"
                onClick={() => onClearClick(date)}
                disabled={exercises.length === 0}
                style={
                  exercises.length === 0
                    ? { opacity: 0.5, pointerEvents: "none" }
                    : {}
                }
              >
                {t("newPlan.dayCard.clearButton")}
              </Button>
              <Text size="sm" c="dimmed">
                {format(date, "dd/MM/yyyy")}
              </Text>
            </Group>
          </Group>
          <Divider mt="sm" />
          {/* Add Model Button */}
          <Button
            variant="outline"
            color="blue"
            onClick={() => onAddModelClick(date)}
          >
            {t("newPlan.dayCard.addModelButton")}
          </Button>
          {/* Exercise List */}
          <Stack style={{ maxHeight: "200px", overflowY: "auto" }}>
            {exercises.map((exercise, exIndex) => (
              <Card
                key={exIndex}
                shadow="sm"
                padding="lg"
                style={{
                  border: "1px solid #ccc",
                  position: "relative",
                  minHeight: "90px",
                }}
              >
                <Text size="sm">{exercise.name}</Text>
                <Text size="xs" c="dimmed">
                  {exercise.series} x{" "}
                  {exercise.reps === 0 ? t("common.failure") : exercise.reps}
                  {!!exercise.advancedTechnique && (
                    <> - {exercise.advancedTechnique}</>
                  )}
                  {exercise.restTime
                    ? ` | ${t("common.rest")}: ${exercise.restTime}s`
                    : ""}
                </Text>
              </Card>
            ))}
          </Stack>
          {/* Edit/Create Button */}
          <Button
            variant="light"
            c="green"
            onClick={() => onEditCreateClick(date)}
          >
            {exercises.length > 0
              ? t("newPlan.dayCard.editTrainingButton")
              : t("newPlan.dayCard.createTrainingButton")}
          </Button>
        </Stack>
      </Card>

      {/* Week Options Card (Conditionally Rendered) */}
      {isWeekEnd && !isLastDay && (
        <Card
          shadow="sm"
          padding="lg"
          style={{
            border: "2px dashed #4caf50",
            gridColumn: "span 2", // Make it span both columns
          }}
        >
          <Stack>
            <Text size="md">
              {t("newPlan.dayCard.weekOptionsTitle", {
                weekNum: Math.floor(index / 7) + 1,
              })}
            </Text>
            <Group grow>
              <Button
                variant="outline"
                c="blue"
                onClick={() =>
                  onReplicateWeek(trainingDays[index - 6].date, false)
                }
                disabled={!canReplicateWeek}
                style={
                  !canReplicateWeek
                    ? { opacity: 0.5, pointerEvents: "none" }
                    : {}
                }
              >
                {t("newPlan.dayCard.replicateNextWeekButton")}
              </Button>
              <Button
                variant="filled"
                onClick={() =>
                  onReplicateWeek(trainingDays[index - 6].date, true)
                }
                disabled={!canReplicateWeek}
                style={
                  !canReplicateWeek
                    ? { opacity: 0.5, pointerEvents: "none" }
                    : {}
                }
              >
                {t("newPlan.dayCard.replicateAllWeeksButton")}
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </Fragment>
  );
}
