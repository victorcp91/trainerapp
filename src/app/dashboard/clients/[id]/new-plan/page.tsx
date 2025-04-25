"use client";

import { useEffect } from "react";
import {
  Text,
  Group,
  Stack,
  Divider,
  Button,
  Modal,
  SimpleGrid,
  Container,
  Title,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { useState } from "react";
import { eachDayOfInterval, format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import "dayjs/locale/pt-br";

import { ExerciseModal } from "@/components/dashboard/ExerciseModal";
import { TrainingInfoCard } from "@/components/newPlan/TrainingInfoCard";
import { SeriesInfoForm } from "@/components/newPlan/SeriesInfoForm";
import { TrainingDayCard } from "@/components/newPlan/TrainingDayCard";
import { ReplicateTrainingModal } from "@/components/newPlan/ReplicateTrainingModal";
import { MoveTrainingModal } from "@/components/newPlan/MoveTrainingModal";
import { AddModelModal } from "@/components/newPlan/AddModelModal";
import { Exercise } from "@/types/exercise";
import { TrainingModel } from "@/types/training";
import { ExerciseModalSaveData } from "@/types/modal";

interface SerieModel {
  value: string;
  label: string;
  level: string;
}
interface Level {
  value: string;
  label: string;
}
interface TrainingDay {
  date: Date;
  exercises: Exercise[];
}

function NewPlanPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [exerciseModalOpened, setExerciseModalOpened] = useState(false);
  const [replicateModalOpened, setReplicateModalOpened] = useState(false);
  const [publishModalOpened, setPublishModalOpened] = useState(false);
  const [moveModalOpened, setMoveModalOpened] = useState(false);
  const [selectedTrainingType, setSelectedTrainingType] = useState<
    string | null
  >(null);
  const [selectedSerieModel, setSelectedSerieModel] = useState<string | null>(
    null
  );
  const [dayAssignments, setDayAssignments] = useState<string[]>([]);
  const [triedSerieModelSearch, setTriedSerieModelSearch] = useState(false);
  const [seriesModalOpened, setSeriesModalOpened] = useState(false);
  const [applySerieModalOpened, setApplySerieModalOpened] = useState(false);
  const [addModelModalOpened, setAddModelModalOpened] = useState(false);
  const [modelTargetDay, setModelTargetDay] = useState<Date | null>(null);

  const serieModelTrainings: {
    [key: string]: { name: string; exercises: Exercise[] }[];
  } = {
    "serie-1": [
      {
        name: "Treino A",
        exercises: [
          {
            name: "Supino",
            series: 3,
            reps: 12,
            advancedTechnique: "",
            notes: "",
            restTime: 60,
          },
        ],
      },
      {
        name: "Treino B",
        exercises: [
          {
            name: "Agachamento",
            series: 4,
            reps: 10,
            advancedTechnique: "",
            notes: "",
            restTime: 90,
          },
        ],
      },
      {
        name: "Treino C",
        exercises: [
          {
            name: "Remada",
            series: 3,
            reps: 12,
            advancedTechnique: "",
            notes: "",
            restTime: 60,
          },
        ],
      },
    ],
    "serie-2": [
      {
        name: "Treino X",
        exercises: [
          {
            name: "Puxada",
            series: 3,
            reps: 10,
            advancedTechnique: "",
            notes: "",
            restTime: 60,
          },
        ],
      },
      {
        name: "Leg Press",
        exercises: [
          {
            name: "Leg Press",
            series: 4,
            reps: 12,
            advancedTechnique: "",
            notes: "",
            restTime: 90,
          },
        ],
      },
    ],
    "serie-3": [
      {
        name: "Treino Z",
        exercises: [
          {
            name: "Desenvolvimento",
            series: 3,
            reps: 8,
            advancedTechnique: "",
            notes: "",
            restTime: 60,
          },
        ],
      },
    ],
  };

  const serieModels: SerieModel[] = [
    { value: "serie-1", label: "Série 1", level: "iniciante" },
    { value: "serie-2", label: "Série 2", level: "intermediario" },
    { value: "serie-3", label: "Série 3", level: "avancado" },
  ];

  const levels: Level[] = [
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avancado", label: "Avançado" },
  ];

  const trainingModels: TrainingModel[] = [
    {
      name: "Modelo de Força",
      description: "Treino focado em ganho de força muscular.",
      id: "model-1",
      createdAt: new Date().toISOString(),
      isFavorite: false,
      exercises: [
        {
          name: "Supino Reto",
          series: 4,
          reps: 10,
          advancedTechnique: "",
          notes: "",
          restTime: 60,
        },
        {
          name: "Agachamento",
          series: 4,
          reps: 12,
          advancedTechnique: "",
          notes: "",
          restTime: 90,
        },
      ],
    },
    {
      name: "Modelo de Resistência",
      description: "Treino para melhorar a resistência física.",
      id: "model-2",
      createdAt: new Date().toISOString(),
      isFavorite: false,
      exercises: [
        {
          name: "Corrida",
          series: 1,
          reps: 20,
          advancedTechnique: "",
          notes: "",
          restTime: 0,
        },
        {
          name: "Flexão",
          series: 3,
          reps: 15,
          advancedTechnique: "",
          notes: "",
          restTime: 45,
        },
      ],
    },
    {
      name: "Modelo de Hipertrofia",
      description: "Treino voltado para aumento de massa muscular.",
      id: "model-3",
      createdAt: new Date().toISOString(),
      isFavorite: false,
      exercises: [
        {
          name: "Levantamento Terra",
          series: 5,
          reps: 8,
          advancedTechnique: "",
          notes: "",
          restTime: 120,
        },
        {
          name: "Barra Fixa",
          series: 4,
          reps: 10,
          advancedTechnique: "",
          notes: "",
          restTime: 90,
        },
      ],
    },
  ];

  const autoAssignTrainingsToFirstWeek = () => {
    if (!selectedSerieModel || trainingDays.length === 0) return;
    const trainings = serieModelTrainings[selectedSerieModel] || [];
    let treinoIdx = 0;
    const firstWeekAssignments = trainingDays.slice(0, 7).map((d) => {
      const dayName = format(d.date, "EEEE", { locale: ptBR }).toLowerCase();
      const isAvailable = availableDays.includes(dayName);
      if (isAvailable && treinoIdx < trainings.length) {
        const treinoName = trainings[treinoIdx].name;
        treinoIdx++;
        return treinoName;
      }
      return "Descanso";
    });
    const fullAssignments = trainingDays.map(
      (_, idx) => firstWeekAssignments[idx % 7]
    );
    setDayAssignments(fullAssignments);
  };

  useEffect(() => {
    if (
      applySerieModalOpened &&
      selectedSerieModel &&
      trainingDays.length > 0
    ) {
      autoAssignTrainingsToFirstWeek();
    }
  }, [applySerieModalOpened, selectedSerieModel, trainingDays.length]);

  const handleAddSerieToPlan = (serieValue: string) => {
    setSelectedSerieModel(serieValue);
    setSeriesModalOpened(false);
    setApplySerieModalOpened(true);
  };

  const handleApplySerieToPlan = () => {
    if (!selectedSerieModel) return;
    const trainings = serieModelTrainings[selectedSerieModel] || [];
    setTrainingDays((prev) =>
      prev.map((day, idx) => {
        const assign = dayAssignments[idx];
        if (!assign || assign === "Descanso") return { ...day, exercises: [] };
        const treino = trainings.find((t) => t.name === assign);
        return treino
          ? { ...day, exercises: treino.exercises }
          : { ...day, exercises: [] };
      })
    );
    setApplySerieModalOpened(false);
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    if (start && end && start <= end) {
      const days = eachDayOfInterval({ start, end }).map((date) => ({
        date,
        exercises: [],
      }));
      setTrainingDays(days);
      setDayAssignments(Array(days.length).fill("Descanso"));
    } else {
      setTrainingDays([]);
      setDayAssignments([]);
    }
  };

  const handleDateRangeChange = (
    newStart: Date | null,
    newEnd: Date | null
  ) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    handleDateChange(newStart, newEnd);
  };

  const openExerciseModal = (day: Date) => {
    setSelectedDay(day);
    setExerciseModalOpened(true);
  };

  const handleModalSave = (saveData: ExerciseModalSaveData) => {
    if (!selectedDay) return;
    const tempExercises = saveData.exercises;
    setTrainingDays((prev) =>
      prev.map((day) =>
        day.date.getTime() === selectedDay.getTime()
          ? { ...day, exercises: tempExercises }
          : day
      )
    );
    setExerciseModalOpened(false);
  };

  const handleModalClose = () => {
    setExerciseModalOpened(false);
  };

  const handleReplicateTrainingConfirm = (
    option: string | null,
    dates: Date[]
  ) => {
    if (!selectedDay) return;
    setTrainingDays((prev) => {
      const sourceDay = prev.find(
        (day) => day.date.getTime() === selectedDay.getTime()
      );
      if (!sourceDay) return prev;

      const sourceExercises = sourceDay.exercises || [];

      return prev.map((day) => {
        let newExercises = day.exercises || [];
        if (option && day.date.getTime() !== sourceDay.date.getTime()) {
          const daysDiff = differenceInDays(day.date, selectedDay);
          if (
            (option === "Toda semana" && daysDiff % 7 === 0 && daysDiff > 0) ||
            (option !== "Toda semana" &&
              option.match(/\d+/) &&
              daysDiff % parseInt(option.match(/\d+/)?.[0] || "1", 10) === 0 &&
              daysDiff > 0)
          ) {
            newExercises = [...newExercises, ...sourceExercises];
          }
        }
        const isSelectedInCalendar = dates.some(
          (d) => d.toDateString() === day.date.toDateString()
        );
        if (
          isSelectedInCalendar &&
          day.date.getTime() !== sourceDay.date.getTime()
        ) {
          newExercises = [...newExercises, ...sourceExercises];
        }
        return { ...day, exercises: newExercises };
      });
    });
    setReplicateModalOpened(false);
  };

  const closeReplicateModal = () => {
    setReplicateModalOpened(false);
  };

  const handleReplicateWeek = (startDay: Date, replicateToEnd: boolean) => {
    setTrainingDays((prev) => {
      const startIndex = prev.findIndex(
        (day) => day.date.getTime() === startDay.getTime()
      );
      if (startIndex === -1 || startIndex + 7 > prev.length) return prev;

      const weekToReplicate = prev.slice(startIndex, startIndex + 7);
      const newTrainingDays = [...prev];

      for (let i = startIndex + 7; i < newTrainingDays.length; i += 7) {
        if (!replicateToEnd && i >= startIndex + 14) break;

        weekToReplicate.forEach((dayToReplicate, offset) => {
          if (newTrainingDays[i + offset]) {
            newTrainingDays[i + offset].exercises = [
              ...dayToReplicate.exercises,
            ];
          }
        });
      }

      return newTrainingDays;
    });
  };

  const handleMoveTrainingConfirm = (targetDate: Date) => {
    if (!selectedDay || selectedDay.getTime() === targetDate.getTime()) return;
    setTrainingDays((prev) => {
      const sourceDayIdx = prev.findIndex(
        (d) => d.date.getTime() === selectedDay.getTime()
      );
      const targetDayIdx = prev.findIndex(
        (d) => d.date.getTime() === targetDate.getTime()
      );
      if (sourceDayIdx === -1 || targetDayIdx === -1) return prev;
      const sourceExercises = prev[sourceDayIdx].exercises;
      return prev.map((d, idx) => {
        if (idx === sourceDayIdx) return { ...d, exercises: [] };
        if (idx === targetDayIdx) return { ...d, exercises: sourceExercises };
        return d;
      });
    });
    setMoveModalOpened(false);
  };

  const closeMoveModal = () => {
    setMoveModalOpened(false);
  };

  const handlePublish = () => {
    console.log("Treino publicado", {
      trainingDays,
      startDate,
      endDate,
      selectedTrainingType,
    });
    setPublishModalOpened(false);
  };

  const availableDays = ["segunda-feira", "quarta-feira", "sexta-feira"];

  const handleReplicateDayClick = (date: Date) => {
    setSelectedDay(date);
    setReplicateModalOpened(true);
  };

  const handleMoveDayClick = (date: Date) => {
    setSelectedDay(date);
    setMoveModalOpened(true);
  };

  const handleClearDayClick = (date: Date) => {
    setTrainingDays((prev) =>
      prev.map((day) =>
        day.date.getTime() === date.getTime() ? { ...day, exercises: [] } : day
      )
    );
  };

  const handleAddModelDayClick = (date: Date) => {
    setModelTargetDay(date);
    setAddModelModalOpened(true);
  };

  const handleAddModelConfirm = (modelToAdd: TrainingModel) => {
    if (!modelTargetDay) return;
    setTrainingDays((prev) =>
      prev.map((day) =>
        day.date.getTime() === modelTargetDay.getTime()
          ? { ...day, exercises: modelToAdd.exercises || [] }
          : day
      )
    );
    setAddModelModalOpened(false);
    setModelTargetDay(null);
  };

  const closeAddModelModal = () => {
    setAddModelModalOpened(false);
    setModelTargetDay(null);
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        Nova Série
      </Title>
      <DatesProvider settings={{ locale: "pt-br" }}>
        <Stack>
          <Divider my="sm" />
          <TrainingInfoCard />
          <SeriesInfoForm
            startDate={startDate}
            endDate={endDate}
            selectedTrainingType={selectedTrainingType}
            selectedSerieModel={selectedSerieModel}
            triedSerieModelSearch={triedSerieModelSearch}
            serieModels={serieModels}
            levels={levels}
            trainingDays={trainingDays}
            dayAssignments={dayAssignments}
            serieModelTrainings={serieModelTrainings}
            seriesModalOpened={seriesModalOpened}
            applySerieModalOpened={applySerieModalOpened}
            onCloseSeriesModal={() => setSeriesModalOpened(false)}
            onCloseApplySerieModal={() => setApplySerieModalOpened(false)}
            onDateRangeChange={handleDateRangeChange}
            onSelectedTrainingTypeChange={setSelectedTrainingType}
            onDayAssignmentChange={
              ((newAssignments: string[]) => {
                setDayAssignments(newAssignments);
                for (let i = 0; i < newAssignments.length; i++) {
                  if (newAssignments[i] !== "Descanso") {
                    autoAssignTrainingsToFirstWeek();
                    break;
                  }
                }
              }) as unknown as (index: number, value: string | null) => void
            }
            onOpenSeriesModal={() => {
              if (!startDate || !endDate) {
                setTriedSerieModelSearch(true);
              } else {
                setTriedSerieModelSearch(false);
                setSeriesModalOpened(true);
              }
            }}
            onSaveDraft={() => console.log("Save Draft from Page")}
            onPublish={() => setPublishModalOpened(true)}
            onAddSerieToPlan={handleAddSerieToPlan}
            onApplySerieToPlan={handleApplySerieToPlan}
            setTriedSerieModelSearch={setTriedSerieModelSearch}
          />
          <Modal
            opened={publishModalOpened}
            onClose={() => setPublishModalOpened(false)}
            title="Confirmar Publicação"
            closeOnClickOutside
          >
            <Text>
              Nem todos os dias disponíveis apontados pelo cliente possuem
              treinos. Deseja continuar com a publicação?
            </Text>
            <Group mt="md">
              <Button
                variant="outline"
                onClick={() => setPublishModalOpened(false)}
              >
                Cancelar
              </Button>
              <Button variant="filled" c="green" onClick={handlePublish}>
                Confirmar
              </Button>
            </Group>
          </Modal>
          <SimpleGrid cols={2} spacing="lg">
            {trainingDays.map((dayData, index) => {
              return (
                <TrainingDayCard
                  key={dayData.date.toISOString()}
                  dayData={dayData}
                  index={index}
                  isAvailableDay={availableDays.includes(
                    format(dayData.date, "EEEE", { locale: ptBR }).toLowerCase()
                  )}
                  trainingDays={trainingDays}
                  onReplicateClick={handleReplicateDayClick}
                  onMoveClick={handleMoveDayClick}
                  onClearClick={handleClearDayClick}
                  onAddModelClick={handleAddModelDayClick}
                  onEditCreateClick={openExerciseModal}
                  onReplicateWeek={handleReplicateWeek}
                />
              );
            })}
          </SimpleGrid>
          <ExerciseModal
            handleModalClose={handleModalClose}
            handleModalSave={handleModalSave}
            modalOpened={exerciseModalOpened}
            editingModel={null}
          />
          <ReplicateTrainingModal
            opened={replicateModalOpened}
            onClose={closeReplicateModal}
            startDate={startDate}
            endDate={endDate}
            selectedDay={selectedDay}
            onConfirm={handleReplicateTrainingConfirm}
            handleReplicateWeek={handleReplicateWeek}
          />
          <MoveTrainingModal
            opened={moveModalOpened}
            onClose={closeMoveModal}
            startDate={startDate}
            endDate={endDate}
            selectedDay={selectedDay}
            onConfirm={handleMoveTrainingConfirm}
          />
          <AddModelModal
            opened={addModelModalOpened}
            onClose={closeAddModelModal}
            trainingModels={trainingModels}
            onConfirm={handleAddModelConfirm}
          />
        </Stack>
      </DatesProvider>
    </Container>
  );
}

export default NewPlanPage;
