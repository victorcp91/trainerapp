import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Card,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Box,
  SegmentedControl,
} from "@mantine/core";
import {
  IconGripVertical,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
// Import needed types
import type { TrainingModel, Exercise } from "@/types/training";
import type { ExerciseModalSaveData } from "@/types/modal";
import { useTranslations } from "next-intl";

interface IExerciseModal {
  handleModalSave: (saveData: ExerciseModalSaveData) => void;
  handleModalClose: () => void;
  modalOpened: boolean;
  editingModel: TrainingModel | null;
}

// New Component for Draggable Exercise Item
interface DraggableExerciseItemProps {
  exercise: Exercise;
  index: number;
  handleRemoveExercise: (index: number) => void;
  t: ReturnType<typeof useTranslations>;
}

function DraggableExerciseItem({
  exercise,
  index,
  handleRemoveExercise,
  t,
}: DraggableExerciseItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exercise.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine exercise type for display
  const isHiit = exercise.type === "hiit_aerobic";
  const isSteadyAerobic = exercise.type === "steady_aerobic";
  const isStretching = exercise.type === "stretching";

  // Combine flags for overall aerobic check
  const isAerobic = isHiit || isSteadyAerobic;

  return (
    <div ref={setNodeRef} style={style} key={exercise.id}>
      <Card
        withBorder
        p="xs"
        bg={isAerobic ? "yellow.0" : isStretching ? "blue.0" : undefined}
      >
        <Group justify="space-between">
          <Group gap="xs" align="center">
            <Box
              {...attributes}
              {...listeners}
              style={{ cursor: "grab", display: "flex", alignItems: "center" }}
            >
              <IconGripVertical size={16} />
            </Box>
            <Stack gap={0}>
              <Text fw={500}>{exercise.name}</Text>
              {/* Conditional display for details */}
              {isHiit ? (
                <Text size="sm" c="dimmed">
                  HIIT: {exercise.hiitRounds} rounds ({exercise.hiitWorkTime}s /{" "}
                  {exercise.hiitRestTime}s)
                </Text>
              ) : isSteadyAerobic ? (
                <Text size="sm" c="dimmed">
                  {exercise.duration ? `${exercise.duration} min` : ""}
                  {exercise.duration && exercise.distance ? " / " : ""}
                  {exercise.distance ? `${exercise.distance} km` : ""}
                  {/* Combine Intensity label and value translation */}
                  {exercise.intensity
                    ? ` (${t("dashboard.exerciseModal.intensity")} ${t(
                        "dashboard.exerciseModal." +
                          exercise.intensity +
                          "Intensity"
                      )})`
                    : ""}
                </Text>
              ) : isStretching ? (
                <Text size="sm" c="dimmed">
                  {exercise.repetitions}{" "}
                  {t("common.repetitions", { defaultValue: "reps" })} •{" "}
                  {exercise.holdTime}s{" "}
                  {t("common.holdTimeShort", { defaultValue: "Hold" })}
                </Text>
              ) : (
                // Strength display
                <Text size="sm" c="dimmed">
                  {exercise.series}x
                  {exercise.reps > 0
                    ? exercise.reps
                    : t("common.failureShort", { defaultValue: "F" })}{" "}
                  • {exercise.restTime}s{" "}
                  {t("common.restShort", { defaultValue: "Rest" })}
                  {exercise.advancedTechnique && (
                    <Text span size="xs" c="blue">
                      ({exercise.advancedTechnique})
                    </Text>
                  )}
                </Text>
              )}
              {exercise.notes && (
                <Text size="xs" mt={2}>
                  {exercise.notes}
                </Text>
              )}
            </Stack>
          </Group>
          <IconTrash
            size={16}
            color="red"
            onClick={() => handleRemoveExercise(index)}
            style={{ cursor: "pointer", marginLeft: "auto" }}
          />
        </Group>
      </Card>
    </div>
  );
}

export function ExerciseModal({
  handleModalClose,
  handleModalSave,
  modalOpened,
  editingModel,
}: IExerciseModal) {
  const t = useTranslations();
  const [untilFailure, setUntilFailure] = useState(false);
  const [fieldsError, setFieldsError] = useState<string>("");
  const [nextTempId, setNextTempId] = useState(0);
  const [tempExercises, setTempExercises] = useState<Exercise[]>(
    (editingModel?.exercises || []).map((ex, index) => ({
      ...ex,
      id: ex.id ?? `temp-${index}`,
    }))
  );
  const [modelName, setModelName] = useState(editingModel?.name || "");
  const [modelDescription, setModelDescription] = useState(
    editingModel?.description || ""
  );

  useEffect(() => {
    if (editingModel) {
      setModelName(editingModel.name);
      setModelDescription(editingModel.description);
      setTempExercises(
        (editingModel.exercises || []).map((ex, index) => ({
          ...ex,
          id: ex.id ?? `temp-${index}`,
        }))
      );
      setNextTempId((editingModel.exercises || []).length);
    } else {
      setModelName("");
      setModelDescription("");
      setTempExercises([]);
      setNextTempId(0);
    }
  }, [editingModel, modalOpened]);

  // State for exercise type filter
  const [exerciseTypeFilter, setExerciseTypeFilter] = useState<
    "strength" | "aerobic" | "stretching"
  >("strength");

  // State for aerobic subtype filter
  const [aerobicTypeFilter, setAerobicTypeFilter] = useState<"steady" | "hiit">(
    "steady"
  );

  const [filters, setFilters] = useState({
    muscleGroup: "",
    subMuscleGroup: "",
    equipment: "",
    search: "",
    favorite: false,
  });
  const [exerciseDetails, setExerciseDetails] = useState({
    series: "",
    reps: "",
    advancedTechnique: "",
    notes: "",
    restTime: "",
    duration: "",
    distance: "",
    intensity: "",
    hiitWorkTime: "",
    hiitRestTime: "",
    hiitRounds: "",
    holdTime: "",
    repetitions: "",
  });
  const [favoriteExercises, setFavoriteExercises] = useState<number[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  // Define muscle subgroup mapping (example data)
  const muscleSubgroupMap: Record<string, string[]> = {
    Costas: [
      "Dorsais",
      "Lombares",
      "Trapézio",
      "Cabo",
      "Peso corporal",
      "Barra",
    ], // Added sample subgroups
    Pernas: [
      "Quadríceps",
      "Posteriores",
      "Glúteos",
      "Panturrilhas",
      "Máquina",
      "Peso corporal",
      "Barra",
    ],
    Braços: ["Bíceps", "Tríceps", "Antebraço", "Halteres", "Cabo"],
    Ombros: [
      "Deltoide Anterior",
      "Deltoide Lateral",
      "Deltoide Posterior",
      "Halteres",
    ],
    Core: ["Abdômen Reto", "Oblíquos", "Lombar", "Peso corporal"],
  };

  // Define available equipment (extracted from sample data or predefined)
  const availableEquipment = [
    "Cabo",
    "Peso corporal",
    "Barra",
    "Máquina",
    "Halteres",
  ];

  // Get available subgroups based on selected muscle group
  const availableSubgroups = filters.muscleGroup
    ? muscleSubgroupMap[filters.muscleGroup] || []
    : [];

  // Combined list of exercises (strength and aerobic)
  const allExercises = [
    {
      id: 1,
      name: "Remada Sentada",
      group: "Costas",
      subGroup: "Cabo",
      equipment: "Cabo",
      type: "strength",
    },
    {
      id: 2,
      name: "Barra Fixa",
      group: "Costas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
      type: "strength",
    },
    {
      id: 3,
      name: "Levantamento Terra",
      group: "Costas",
      subGroup: "Barra",
      equipment: "Barra",
      type: "strength",
    },
    {
      id: 4,
      name: "Agachamento",
      group: "Pernas",
      subGroup: "Barra",
      equipment: "Barra",
      type: "strength",
    },
    {
      id: 5,
      name: "Leg Press",
      group: "Pernas",
      subGroup: "Máquina",
      equipment: "Máquina",
      type: "strength",
    },
    {
      id: 6,
      name: "Avanço",
      group: "Pernas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
      type: "strength",
    },
    {
      id: 7,
      name: "Rosca Direta",
      group: "Braços",
      subGroup: "Halteres",
      equipment: "Halteres",
      type: "strength",
    },
    {
      id: 8,
      name: "Extensão de Tríceps",
      group: "Braços",
      subGroup: "Cabo",
      equipment: "Cabo",
      type: "strength",
    },
    {
      id: 9,
      name: "Desenvolvimento de Ombro",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
      type: "strength",
    },
    {
      id: 10,
      name: "Elevação Lateral",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
      type: "strength",
    },
    {
      id: 11,
      name: "Prancha",
      group: "Core",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
      type: "strength",
    },
    {
      id: 12,
      name: "Torção Russa",
      group: "Core",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
      type: "strength",
    },
    {
      id: 101,
      name: "Corrida (Esteira)",
      group: "Aeróbico",
      subGroup: "Esteira",
      equipment: "Esteira",
      type: "steady_aerobic",
      isOutdoor: false,
    },
    {
      id: 102,
      name: "Bicicleta Ergométrica",
      group: "Aeróbico",
      subGroup: "Bicicleta",
      equipment: "Bicicleta",
      type: "steady_aerobic",
      isOutdoor: false,
    },
    {
      id: 103,
      name: "Elíptico (Transport)",
      group: "Aeróbico",
      subGroup: "Elíptico",
      equipment: "Elíptico",
      type: "steady_aerobic",
      isOutdoor: false,
    },
    {
      id: 104,
      name: "Pular Corda",
      group: "Aeróbico",
      subGroup: "Corda",
      equipment: "Corda",
      type: "steady_aerobic",
      isOutdoor: false,
    },
    {
      id: 105,
      name: "Escada (Simulador)",
      group: "Aeróbico",
      subGroup: "Escada",
      equipment: "Escada",
      type: "steady_aerobic",
      isOutdoor: false,
    },
    {
      id: 106,
      name: "Corrida (Rua)",
      group: "Aeróbico",
      subGroup: "Outdoor",
      equipment: "Nenhum",
      type: "steady_aerobic",
      isOutdoor: true,
    },
    {
      id: 107,
      name: "HIIT (Esteira)",
      group: "Aeróbico",
      subGroup: "Esteira",
      equipment: "Esteira",
      type: "hiit_aerobic",
      isOutdoor: false,
    },
    {
      id: 108,
      name: "HIIT (Parque - Sprints)",
      group: "Aeróbico",
      subGroup: "Outdoor",
      equipment: "Nenhum",
      type: "hiit_aerobic",
      isOutdoor: true,
    },
    {
      id: 201,
      name: "Alongamento Quadríceps",
      group: "Pernas",
      subGroup: "Estático",
      equipment: "Peso corporal",
      type: "stretching",
    },
    {
      id: 202,
      name: "Alongamento Isquiotibiais",
      group: "Pernas",
      subGroup: "Estático",
      equipment: "Peso corporal",
      type: "stretching",
    },
    {
      id: 203,
      name: "Alongamento Peitoral",
      group: "Peito",
      subGroup: "Dinâmico",
      equipment: "Peso corporal",
      type: "stretching",
    },
    {
      id: 204,
      name: "Alongamento Gato-Camelo",
      group: "Costas",
      subGroup: "Dinâmico",
      equipment: "Peso corporal",
      type: "stretching",
    },
  ];

  const filteredExercises = allExercises.filter((exercise) => {
    // Filter by selected exercise type (strength/aerobic/stretching)
    const typeMatch =
      exercise.type === exerciseTypeFilter ||
      (exerciseTypeFilter === "aerobic" &&
        (exercise.type === "steady_aerobic" ||
          exercise.type === "hiit_aerobic"));

    // Conditionally apply filters based on type
    const muscleGroupMatch =
      exerciseTypeFilter === "aerobic" ||
      !filters.muscleGroup ||
      exercise.group === filters.muscleGroup;

    const subMuscleGroupMatch =
      exerciseTypeFilter !== "strength" ||
      !filters.subMuscleGroup ||
      exercise.subGroup === filters.subMuscleGroup;

    const equipmentMatch =
      exerciseTypeFilter === "stretching" ||
      !filters.equipment ||
      exercise.equipment === filters.equipment;

    // Common filters
    const searchMatch =
      !filters.search ||
      exercise.name.toLowerCase().includes(filters.search.toLowerCase());
    const favoriteMatch =
      !filters.favorite || favoriteExercises.includes(exercise.id);

    return (
      typeMatch &&
      muscleGroupMatch &&
      subMuscleGroupMatch &&
      equipmentMatch &&
      searchMatch &&
      favoriteMatch
    );
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempExercises((exercises) => {
        const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
        const newIndex = exercises.findIndex((ex) => ex.id === over.id);
        return arrayMove(exercises, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveExercise = (index: number) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDirectAddExercise = (exerciseId: number) => {
    // Reset error state specifically for this action
    setFieldsError("");
    setShowErrors(false);

    const exerciseToAdd = filteredExercises.find((ex) => ex.id === exerciseId);
    if (!exerciseToAdd) return;

    let newExercise: Exercise | undefined = undefined;
    let requiredFieldsMet = false;
    let errorKey = "";

    if (exerciseTypeFilter === "strength") {
      const seriesVal = String(exerciseDetails.series).trim();
      const repsVal = String(exerciseDetails.reps).trim();
      const restVal = String(exerciseDetails.restTime).trim();

      requiredFieldsMet =
        seriesVal !== "" && !untilFailure && repsVal !== "" && restVal !== "";
      errorKey = "dashboard.exerciseModal.errorAddRequiredFields";

      if (requiredFieldsMet) {
        newExercise = {
          type: "strength",
          name: exerciseToAdd.name,
          series: Number(seriesVal),
          reps: untilFailure ? 0 : Number(repsVal),
          advancedTechnique: exerciseDetails.advancedTechnique,
          notes: exerciseDetails.notes,
          restTime: Number(restVal),
          id: `temp-${nextTempId}`,
          duration: undefined,
          distance: undefined,
          intensity: undefined,
          hiitWorkTime: undefined,
          hiitRestTime: undefined,
          hiitRounds: undefined,
          holdTime: undefined,
          repetitions: undefined,
        };
      }
    } else if (exerciseTypeFilter === "aerobic") {
      if (aerobicTypeFilter === "steady") {
        const durationVal = String(exerciseDetails.duration).trim();
        const distanceVal = String(exerciseDetails.distance).trim();
        const intensityVal = exerciseDetails.intensity;

        requiredFieldsMet = durationVal !== "" || distanceVal !== "";
        errorKey = "dashboard.exerciseModal.errorAddAerobicFields";

        if (requiredFieldsMet) {
          newExercise = {
            type: "steady_aerobic",
            name: exerciseToAdd.name,
            notes: exerciseDetails.notes,
            duration: durationVal ? Number(durationVal) : undefined,
            distance: distanceVal ? Number(distanceVal) : undefined,
            intensity: intensityVal || undefined,
            id: `temp-${nextTempId}`,
            series: 0,
            reps: 0,
            restTime: undefined,
            advancedTechnique: "",
            hiitWorkTime: undefined,
            hiitRestTime: undefined,
            hiitRounds: undefined,
            holdTime: undefined,
            repetitions: undefined,
          };
        }
      } else {
        const workTimeVal = String(exerciseDetails.hiitWorkTime).trim();
        const restTimeVal = String(exerciseDetails.hiitRestTime).trim();
        const roundsVal = String(exerciseDetails.hiitRounds).trim();

        requiredFieldsMet =
          workTimeVal !== "" && restTimeVal !== "" && roundsVal !== "";
        errorKey = "dashboard.exerciseModal.errorAddHiitFields";

        if (requiredFieldsMet) {
          newExercise = {
            type: "hiit_aerobic",
            name: exerciseToAdd.name,
            notes: exerciseDetails.notes,
            hiitWorkTime: Number(workTimeVal),
            hiitRestTime: Number(restTimeVal),
            hiitRounds: Number(roundsVal),
            id: `temp-${nextTempId}`,
            series: 0,
            reps: 0,
            restTime: undefined,
            advancedTechnique: "",
            duration: undefined,
            distance: undefined,
            intensity: undefined,
            holdTime: undefined,
            repetitions: undefined,
          };
        }
      }
    } else {
      const holdTimeVal = String(exerciseDetails.holdTime).trim();
      const repetitionsVal = String(exerciseDetails.repetitions).trim();

      requiredFieldsMet = holdTimeVal !== "" && repetitionsVal !== "";
      errorKey = "dashboard.exerciseModal.errorAddStretchingFields";

      if (requiredFieldsMet) {
        newExercise = {
          type: "stretching",
          name: exerciseToAdd.name,
          notes: exerciseDetails.notes,
          holdTime: Number(holdTimeVal),
          repetitions: Number(repetitionsVal),
          id: `temp-${nextTempId}`,
          series: 0,
          reps: 0,
          restTime: undefined,
          advancedTechnique: "",
          duration: undefined,
          distance: undefined,
          intensity: undefined,
          hiitWorkTime: undefined,
          hiitRestTime: undefined,
          hiitRounds: undefined,
        };
      }
    }

    if (!requiredFieldsMet || newExercise === undefined) {
      setFieldsError(t(errorKey));
      setShowErrors(true);
      return;
    }

    setTempExercises((prev: Exercise[]) => [...prev, newExercise]);
    setNextTempId((prevId) => prevId + 1);
  };

  const toggleFavorite = (exerciseId: number) => {
    setFavoriteExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const onSaveChanges = () => {
    // Reset error state specifically for this action
    setFieldsError("");
    setShowErrors(false);

    if (!modelName) {
      setFieldsError(
        t("common.requiredField", {
          field: t("dashboard.exerciseModal.modelNameLabel"),
        })
      );
      setShowErrors(true);
      return;
    }

    const baseSaveData: Omit<ExerciseModalSaveData, "id"> = {
      name: modelName,
      description: modelDescription,
      exercises: tempExercises,
    };

    // Fix type error here: explicitly allow optional 'id'
    let saveData: ExerciseModalSaveData & { id?: string };
    if (editingModel?.id) {
      saveData = {
        ...baseSaveData,
        id: editingModel.id,
      };
    } else {
      // Cast if necessary, though assigning Omit should be fine if id is truly missing
      saveData = baseSaveData;
    }

    handleModalSave(saveData);
  };

  return (
    <Modal
      opened={modalOpened}
      onClose={handleModalClose}
      title={
        <Group justify="space-between" w="100%">
          <Text fw={500}>
            {editingModel
              ? t("dashboard.exerciseModal.editTitle")
              : t("dashboard.exerciseModal.createTitle")}
          </Text>
          <Group ml="xl">
            <Button variant="default" onClick={handleModalClose}>
              {t("common.cancel")}
            </Button>
            <Button onClick={onSaveChanges}>{t("common.saveModel")}</Button>
          </Group>
        </Group>
      }
      fullScreen
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 70px)",
          overflow: "hidden",
        },
      }}
    >
      <Flex gap="md" style={{ flex: 1, overflow: "hidden" }}>
        <Box
          w="30%"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Title order={5} mb="sm">
            {t("dashboard.exerciseModal.modelDetailsTitle")}
          </Title>
          <Stack mb="md">
            <TextInput
              label={t("dashboard.exerciseModal.modelNameLabel")}
              value={modelName}
              onChange={(event) => setModelName(event.currentTarget.value)}
              error={
                showErrors &&
                !modelName &&
                fieldsError ===
                  t("common.requiredField", {
                    field: t("dashboard.exerciseModal.modelNameLabel"),
                  })
                  ? fieldsError
                  : undefined
              }
              required
            />
            <Textarea
              label={t("common.description")}
              value={modelDescription}
              onChange={(event) =>
                setModelDescription(event.currentTarget.value)
              }
              minRows={2}
            />
          </Stack>
          <Title order={5} mb="sm">
            {t("dashboard.exerciseModal.exerciseDetailsTitle")}
          </Title>
          <Box style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
            <Stack gap="sm">
              {/* Conditional Strength Inputs */}
              {exerciseTypeFilter === "strength" && (
                <>
                  <NumberInput
                    label={t("common.series")}
                    placeholder="Ex: 3"
                    value={exerciseDetails.series}
                    onChange={(value) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        series: String(value),
                      })
                    }
                    min={1}
                    allowDecimal={false}
                    error={
                      showErrors && !exerciseDetails.series
                        ? t("common.required")
                        : undefined
                    }
                    required
                  />
                  <NumberInput
                    label={t("common.reps")}
                    placeholder="Ex: 12"
                    value={exerciseDetails.reps}
                    onChange={(value) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        reps: String(value),
                      })
                    }
                    min={1}
                    allowDecimal={false}
                    disabled={untilFailure}
                    required={!untilFailure}
                    error={
                      showErrors && !untilFailure && !exerciseDetails.reps
                        ? t("common.required")
                        : undefined
                    }
                  />
                  <Button
                    variant={untilFailure ? "filled" : "outline"}
                    onClick={() => setUntilFailure(!untilFailure)}
                    size="xs"
                  >
                    {t("common.untilFailure")}
                  </Button>
                  <NumberInput
                    label={t("common.restTimeSeconds")}
                    placeholder="Ex: 60"
                    value={exerciseDetails.restTime}
                    onChange={(value) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        restTime: String(value),
                      })
                    }
                    min={0}
                    allowDecimal={false}
                    error={
                      showErrors && !exerciseDetails.restTime
                        ? t("common.required")
                        : undefined
                    }
                    required
                  />
                  <Select
                    label={t("common.advancedTechnique")}
                    placeholder={t("dashboard.exerciseModal.selectPlaceholder")}
                    data={["Drop-set", "Bi-set", "Rest-pause"]}
                    value={exerciseDetails.advancedTechnique}
                    onChange={(value) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        advancedTechnique: value || "",
                      })
                    }
                    clearable
                  />
                  <Textarea
                    label={t("dashboard.exerciseModal.notesLabel")}
                    placeholder={t("common.addNotesPlaceholder")}
                    value={exerciseDetails.notes}
                    onChange={(event) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        notes: event.currentTarget.value,
                      })
                    }
                    minRows={3}
                  />
                </>
              )}

              {/* Conditional Aerobic Inputs */}
              {exerciseTypeFilter === "aerobic" && (
                <>
                  <SegmentedControl
                    value={aerobicTypeFilter}
                    onChange={(value) =>
                      setAerobicTypeFilter(value as "steady" | "hiit")
                    }
                    data={[
                      {
                        label: t("dashboard.exerciseModal.steady", {
                          defaultValue: "Steady",
                        }),
                        value: "steady",
                      },
                      {
                        label: t("dashboard.exerciseModal.hiit", {
                          defaultValue: "HIIT",
                        }),
                        value: "hiit",
                      },
                    ]}
                  />

                  {/* STEADY FIELDS */}
                  {aerobicTypeFilter === "steady" && (
                    <>
                      <Group grow>
                        <NumberInput
                          label={t("dashboard.exerciseModal.duration", {
                            defaultValue: "Duration (min)",
                          })}
                          placeholder="30"
                          value={Number(exerciseDetails.duration) || ""}
                          onChange={(value) =>
                            setExerciseDetails({
                              ...exerciseDetails,
                              duration: String(value),
                            })
                          }
                          min={1}
                          step={1}
                          error={showErrors && !exerciseDetails.duration}
                        />
                        <NumberInput
                          label={t("dashboard.exerciseModal.distance", {
                            defaultValue: "Distance (km)",
                          })}
                          placeholder="5"
                          value={Number(exerciseDetails.distance) || ""}
                          onChange={(value) =>
                            setExerciseDetails({
                              ...exerciseDetails,
                              distance: String(value),
                            })
                          }
                          min={0.1}
                          step={0.1}
                          decimalScale={1}
                        />
                      </Group>
                      <Select
                        label={t("dashboard.exerciseModal.intensity", {
                          defaultValue: "Intensity",
                        })}
                        placeholder={t(
                          "dashboard.exerciseModal.selectIntensityPlaceholder",
                          { defaultValue: "Select Intensity" }
                        )}
                        data={[
                          {
                            value: "low",
                            label: t("dashboard.exerciseModal.lowIntensity"),
                          },
                          {
                            value: "medium",
                            label: t("dashboard.exerciseModal.mediumIntensity"),
                          },
                          {
                            value: "high",
                            label: t("dashboard.exerciseModal.highIntensity"),
                          },
                          { value: "zone1", label: "Zone 1" }, // Add HR Zones or other metrics
                          { value: "zone2", label: "Zone 2" },
                          { value: "zone3", label: "Zone 3" },
                          { value: "zone4", label: "Zone 4" },
                          { value: "zone5", label: "Zone 5" },
                        ]}
                        value={exerciseDetails.intensity}
                        onChange={(value) =>
                          setExerciseDetails({
                            ...exerciseDetails,
                            intensity: value || "",
                          })
                        }
                        clearable
                      />
                    </>
                  )}

                  {/* HIIT FIELDS */}
                  {aerobicTypeFilter === "hiit" && (
                    <Group grow>
                      <NumberInput
                        label={t("dashboard.exerciseModal.hiitWorkTime", {
                          defaultValue: "Work Time (s)",
                        })}
                        placeholder="30"
                        value={Number(exerciseDetails.hiitWorkTime) || ""}
                        onChange={(value) =>
                          setExerciseDetails({
                            ...exerciseDetails,
                            hiitWorkTime: String(value),
                          })
                        }
                        min={1}
                        error={showErrors && !exerciseDetails.hiitWorkTime}
                      />
                      <NumberInput
                        label={t("dashboard.exerciseModal.hiitRestTime", {
                          defaultValue: "Rest Time (s)",
                        })}
                        placeholder="30"
                        value={Number(exerciseDetails.hiitRestTime) || ""}
                        onChange={(value) =>
                          setExerciseDetails({
                            ...exerciseDetails,
                            hiitRestTime: String(value),
                          })
                        }
                        min={0}
                        error={showErrors && !exerciseDetails.hiitRestTime}
                      />
                      <NumberInput
                        label={t("dashboard.exerciseModal.hiitRounds", {
                          defaultValue: "Rounds",
                        })}
                        placeholder="8"
                        value={Number(exerciseDetails.hiitRounds) || ""}
                        onChange={(value) =>
                          setExerciseDetails({
                            ...exerciseDetails,
                            hiitRounds: String(value),
                          })
                        }
                        min={1}
                        error={showErrors && !exerciseDetails.hiitRounds}
                      />
                    </Group>
                  )}

                  <Textarea
                    label={t("dashboard.exerciseModal.notesLabel")}
                    placeholder={t("common.addNotesPlaceholder")}
                    value={exerciseDetails.notes}
                    onChange={(event) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        notes: event.currentTarget.value,
                      })
                    }
                    minRows={3}
                  />
                  {showErrors && fieldsError && (
                    <Text color="red" size="sm" mt="xs">
                      {fieldsError}
                    </Text>
                  )}
                </>
              )}

              {/* Conditional Stretching Inputs */}
              {exerciseTypeFilter === "stretching" && (
                <>
                  <NumberInput
                    label={t("common.repetitions", {
                      defaultValue: "Repetitions",
                    })}
                    placeholder="Ex: 10"
                    value={exerciseDetails.repetitions}
                    onChange={(value) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        repetitions: String(value),
                      })
                    }
                    min={1}
                    allowDecimal={false}
                    error={
                      showErrors && !exerciseDetails.repetitions
                        ? t("common.required")
                        : undefined
                    }
                    required
                  />
                  <NumberInput
                    label={t("common.holdTimeSeconds", {
                      defaultValue: "Hold Time (seconds)",
                    })}
                    placeholder="Ex: 30"
                    value={exerciseDetails.holdTime}
                    onChange={(value) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        holdTime: String(value),
                      })
                    }
                    min={1}
                    allowDecimal={false}
                    error={
                      showErrors && !exerciseDetails.holdTime
                        ? t("common.required")
                        : undefined
                    }
                    required
                  />
                  <Textarea
                    label={t("dashboard.exerciseModal.notesLabel")}
                    placeholder={t("common.addNotesPlaceholder")}
                    value={exerciseDetails.notes}
                    onChange={(event) =>
                      setExerciseDetails({
                        ...exerciseDetails,
                        notes: event.currentTarget.value,
                      })
                    }
                    minRows={3}
                  />
                  {showErrors && fieldsError && (
                    <Text color="red" size="sm" mt="xs">
                      {fieldsError}
                    </Text>
                  )}
                </>
              )}
            </Stack>
          </Box>
        </Box>
        <Box
          w="40%"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Title order={5} mb="sm">
            {t("dashboard.exerciseModal.addExercisesTitle")}
          </Title>

          <SegmentedControl
            mb="sm"
            value={exerciseTypeFilter}
            onChange={(value) => {
              if (
                value === "strength" ||
                value === "aerobic" ||
                value === "stretching"
              ) {
                setExerciseTypeFilter(value);
                if (value === "stretching") {
                  setExerciseDetails((prev) => ({
                    ...prev,
                    repetitions: "1",
                    series: "",
                    reps: "",
                    restTime: "",
                    advancedTechnique: "",
                    duration: "",
                    distance: "",
                    intensity: "",
                    hiitWorkTime: "",
                    hiitRestTime: "",
                    hiitRounds: "",
                  }));
                } else if (value === "aerobic") {
                  setExerciseDetails((prev) => ({
                    ...prev,
                    series: "",
                    reps: "",
                    restTime: "",
                    advancedTechnique: "",
                    holdTime: "",
                    repetitions: "",
                  }));
                } else {
                  setExerciseDetails((prev) => ({
                    ...prev,
                    duration: "",
                    distance: "",
                    intensity: "",
                    hiitWorkTime: "",
                    hiitRestTime: "",
                    hiitRounds: "",
                    holdTime: "",
                    repetitions: "",
                  }));
                }
              }
            }}
            data={[
              {
                label: t("dashboard.exerciseModal.strengthFilter"),
                value: "strength",
              },
              {
                label: t("dashboard.exerciseModal.aerobicsFilter"),
                value: "aerobic",
              },
              {
                label: t("dashboard.exerciseModal.stretchingFilter", {
                  defaultValue: "Stretching",
                }),
                value: "stretching",
              },
            ]}
            fullWidth
          />

          <Stack gap="sm" mb="sm">
            {exerciseTypeFilter === "strength" && (
              <Group grow align="flex-start">
                <Select
                  label={t("dashboard.exerciseModal.muscleGroupLabel")}
                  placeholder={t(
                    "dashboard.exerciseModal.muscleGroupPlaceholder"
                  )}
                  data={Object.keys(muscleSubgroupMap)}
                  value={filters.muscleGroup}
                  onChange={(value) => {
                    const newMuscleGroup = value || "";
                    setFilters({
                      ...filters,
                      muscleGroup: newMuscleGroup,
                      subMuscleGroup: "",
                    });
                  }}
                  clearable
                />
                <Select
                  label={t("dashboard.exerciseModal.subgroupLabel")}
                  placeholder={t("dashboard.exerciseModal.subgroupPlaceholder")}
                  data={availableSubgroups}
                  value={filters.subMuscleGroup}
                  onChange={(value) =>
                    setFilters({ ...filters, subMuscleGroup: value || "" })
                  }
                  disabled={
                    !filters.muscleGroup || availableSubgroups.length === 0
                  }
                  clearable
                />
              </Group>
            )}

            {exerciseTypeFilter === "stretching" && (
              <Group grow align="flex-start">
                <Select
                  label={t("dashboard.exerciseModal.muscleGroupLabel")}
                  placeholder={t(
                    "dashboard.exerciseModal.muscleGroupPlaceholder"
                  )}
                  data={Object.keys(muscleSubgroupMap)}
                  value={filters.muscleGroup}
                  onChange={(value) => {
                    const newMuscleGroup = value || "";
                    setFilters({
                      ...filters,
                      muscleGroup: newMuscleGroup,
                      subMuscleGroup: "",
                      equipment: "",
                    });
                  }}
                  clearable
                />
              </Group>
            )}

            <Group grow align="flex-end">
              {exerciseTypeFilter !== "stretching" && (
                <Select
                  label={t("dashboard.exerciseModal.equipmentLabel")}
                  placeholder={t(
                    "dashboard.exerciseModal.equipmentPlaceholder"
                  )}
                  data={availableEquipment}
                  value={filters.equipment}
                  onChange={(value) =>
                    setFilters({ ...filters, equipment: value || "" })
                  }
                  clearable
                />
              )}
              <TextInput
                placeholder={t("dashboard.exerciseModal.searchPlaceholder")}
                value={filters.search}
                onChange={(event) =>
                  setFilters({ ...filters, search: event.currentTarget.value })
                }
              />
            </Group>
            <Group>
              <Button
                variant={filters.favorite ? "filled" : "light"}
                onClick={() =>
                  setFilters({ ...filters, favorite: !filters.favorite })
                }
                leftSection={
                  filters.favorite ? (
                    <IconStarFilled size={14} />
                  ) : (
                    <IconStar size={14} />
                  )
                }
                size="xs"
              >
                {t("common.favorites")}
              </Button>
            </Group>
          </Stack>

          <Box style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
            <Card withBorder padding="sm">
              <Stack gap="xs">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
                    <Card key={exercise.id} withBorder padding="xs">
                      <Group justify="space-between">
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {exercise.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {exercise.group} / {exercise.equipment}
                          </Text>
                        </Stack>
                        <Group gap="xs">
                          {favoriteExercises.includes(exercise.id) ? (
                            <IconStarFilled
                              size={16}
                              onClick={() => toggleFavorite(exercise.id)}
                              style={{ cursor: "pointer", color: "gold" }}
                            />
                          ) : (
                            <IconStar
                              size={16}
                              onClick={() => toggleFavorite(exercise.id)}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          <IconPlus
                            size={16}
                            onClick={() => handleDirectAddExercise(exercise.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </Group>
                      </Group>
                    </Card>
                  ))
                ) : (
                  <Text c="dimmed" ta="center" p="md">
                    {t("dashboard.exerciseModal.noExercisesFound")}
                  </Text>
                )}
              </Stack>
            </Card>
          </Box>
        </Box>
        <Box
          w="30%"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Title order={5} mb="sm">
            {t("dashboard.exerciseModal.currentExercisesTitle")}
          </Title>
          <Box style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tempExercises.map((exercise) => exercise.id!)}
                strategy={verticalListSortingStrategy}
              >
                <Stack gap="xs">
                  {tempExercises.map((exercise, index) => (
                    <DraggableExerciseItem
                      key={exercise.id}
                      index={index}
                      exercise={exercise}
                      handleRemoveExercise={handleRemoveExercise}
                      t={t}
                    />
                  ))}
                  {tempExercises.length === 0 && (
                    <Text c="dimmed" ta="center" mt="md">
                      {t("dashboard.exerciseModal.noExercisesAdded")}
                    </Text>
                  )}
                </Stack>
              </SortableContext>
            </DndContext>
          </Box>
        </Box>
      </Flex>
    </Modal>
  );
}
