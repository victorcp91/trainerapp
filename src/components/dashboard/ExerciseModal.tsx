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
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} key={index}>
      <Card withBorder p="xs">
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
              <Text size="sm" c="dimmed">
                {exercise.series}x
                {exercise.reps > 0
                  ? exercise.reps
                  : t("common.failureShort", { defaultValue: "F" })}{" "}
                • {exercise.restTime}s{" "}
                {t("common.restShort", { defaultValue: "Rest" })}
                {exercise.advancedTechnique && (
                  <Text span size="xs" c="blue">
                    {" "}
                    ({exercise.advancedTechnique})
                  </Text>
                )}
              </Text>
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
  const [tempExercises, setTempExercises] = useState<Exercise[]>(
    editingModel?.exercises || []
  );
  const [modelName, setModelName] = useState(editingModel?.name || "");
  const [modelDescription, setModelDescription] = useState(
    editingModel?.description || ""
  );

  useEffect(() => {
    if (editingModel) {
      setModelName(editingModel.name);
      setModelDescription(editingModel.description);
      setTempExercises(editingModel.exercises || []);
    } else {
      setModelName("");
      setModelDescription("");
      setTempExercises([]);
    }
  }, [editingModel, modalOpened]);

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
  });
  const [favoriteExercises, setFavoriteExercises] = useState<number[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const filteredExercises = [
    {
      id: 1,
      name: "Remada Sentada",
      group: "Costas",
      subGroup: "Cabo",
      equipment: "Cabo",
    },
    {
      id: 2,
      name: "Barra Fixa",
      group: "Costas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      id: 3,
      name: "Levantamento Terra",
      group: "Costas",
      subGroup: "Barra",
      equipment: "Barra",
    },
    {
      id: 4,
      name: "Agachamento",
      group: "Pernas",
      subGroup: "Barra",
      equipment: "Barra",
    },
    {
      id: 5,
      name: "Leg Press",
      group: "Pernas",
      subGroup: "Máquina",
      equipment: "Máquina",
    },
    {
      id: 6,
      name: "Avanço",
      group: "Pernas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      id: 7,
      name: "Rosca Direta",
      group: "Braços",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      id: 8,
      name: "Extensão de Tríceps",
      group: "Braços",
      subGroup: "Cabo",
      equipment: "Cabo",
    },
    {
      id: 9,
      name: "Desenvolvimento de Ombro",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      id: 10,
      name: "Elevação Lateral",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      id: 11,
      name: "Prancha",
      group: "Core",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      id: 12,
      name: "Torção Russa",
      group: "Core",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
  ].filter(
    (exercise) =>
      (!filters.muscleGroup || exercise.group === filters.muscleGroup) &&
      (!filters.subMuscleGroup ||
        exercise.subGroup === filters.subMuscleGroup) &&
      (!filters.equipment || exercise.equipment === filters.equipment) &&
      (!filters.search ||
        exercise.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.favorite || favoriteExercises.includes(exercise.id))
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempExercises((exercises) =>
        arrayMove(
          exercises,
          exercises.findIndex((_, i) => i === active.id),
          exercises.findIndex((_, i) => i === over.id)
        )
      );
    }
  };

  const handleRemoveExercise = (index: number) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDirectAddExercise = (exerciseId: number) => {
    const seriesVal = String(exerciseDetails.series).trim();
    const repsVal = String(exerciseDetails.reps).trim();
    const restVal = String(exerciseDetails.restTime).trim();

    if (
      seriesVal === "" ||
      (!untilFailure && repsVal === "") ||
      restVal === ""
    ) {
      setFieldsError(t("dashboard.exerciseModal.errorAddRequiredFields"));
      setShowErrors(true);
      return;
    }
    setFieldsError("");
    setShowErrors(false);

    const exerciseToAdd = filteredExercises.find((ex) => ex.id === exerciseId);
    if (!exerciseToAdd) return;

    const newExercise: Exercise = {
      name: exerciseToAdd.name,
      series: Number(seriesVal),
      reps: untilFailure ? 0 : Number(repsVal),
      advancedTechnique: exerciseDetails.advancedTechnique,
      notes: exerciseDetails.notes,
      restTime: Number(restVal),
    };
    setTempExercises((prev: Exercise[]) => [...prev, newExercise]);
  };

  const toggleFavorite = (exerciseId: number) => {
    setFavoriteExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const onSaveChanges = () => {
    if (!modelName) {
      setFieldsError(
        t("common.requiredField", {
          field: t("dashboard.exerciseModal.modelNameLabel"),
        })
      );
      setShowErrors(true);
      return;
    }
    setFieldsError("");
    setShowErrors(false);

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
        editingModel
          ? t("dashboard.exerciseModal.editTitle")
          : t("dashboard.exerciseModal.createTitle")
      }
      size="90%"
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 160px)",
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
                showErrors && !modelName
                  ? t("common.requiredField", {
                      field: t("dashboard.exerciseModal.modelNameLabel"),
                    })
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
          <Stack gap="sm" mb="sm">
            <Select
              label={t("dashboard.exerciseModal.muscleGroupLabel")}
              placeholder={t("dashboard.exerciseModal.muscleGroupPlaceholder")}
              data={["Costas", "Pernas", "Braços", "Ombros", "Core"]}
              value={filters.muscleGroup}
              onChange={(value) =>
                setFilters({ ...filters, muscleGroup: value || "" })
              }
              clearable
            />
            <TextInput
              placeholder={t("dashboard.exerciseModal.searchPlaceholder")}
              value={filters.search}
              onChange={(event) =>
                setFilters({ ...filters, search: event.currentTarget.value })
              }
            />
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
                items={tempExercises.map((_, index) => index)}
                strategy={verticalListSortingStrategy}
              >
                <Stack gap="xs">
                  {tempExercises.map((exercise, index) => (
                    <DraggableExerciseItem
                      key={index}
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

      <Group
        justify="flex-end"
        mt="md"
        pt="sm"
        style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
      >
        <Button variant="default" onClick={handleModalClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={onSaveChanges}>{t("common.saveModel")}</Button>
      </Group>
    </Modal>
  );
}
