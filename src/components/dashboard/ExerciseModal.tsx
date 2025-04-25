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
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
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

function SortableItem({
  id,
  children,
}: {
  id: number | string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

interface IExerciseModal {
  handleModalSave: (saveData: ExerciseModalSaveData) => void;
  handleModalClose: () => void;
  modalOpened: boolean;
  editingModel: TrainingModel | null;
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
        arrayMove(exercises, Number(active.id), Number(over.id))
      );
    }
  };

  const handleRemoveExercise = (index: number) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDirectAddExercise = (exerciseId: number) => {
    if (
      exerciseDetails.series === "" ||
      (!untilFailure && exerciseDetails.reps === "") ||
      exerciseDetails.restTime === ""
    ) {
      setFieldsError(
        "Preencha os campos obrigatórios: Séries, Repetições/Até a falha e Tempo de Descanso"
      );
      setShowErrors(true);
      return;
    }
    setFieldsError("");
    const exercise = filteredExercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;
    const newExercise: Exercise = {
      name: exercise.name,
      series: Number(exerciseDetails.series),
      reps: Number(exerciseDetails.reps),
      advancedTechnique: exerciseDetails.advancedTechnique,
      notes: exerciseDetails.notes,
      restTime: Number(exerciseDetails.restTime),
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
    const saveData = {
      id: editingModel?.id || Date.now(),
      name: modelName,
      description: modelDescription,
      exercises: tempExercises,
      isFavorite: editingModel?.isFavorite || false,
    };
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
          height: "calc(100% - 60px)",
        },
      }}
    >
      <Stack style={{ flex: 1, overflowY: "auto" }}>
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
          onChange={(event) => setModelDescription(event.currentTarget.value)}
          minRows={2}
        />
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tempExercises.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            <Stack gap="xs" mt="md">
              {tempExercises.map((exercise, index) => (
                <SortableItem key={index} id={index}>
                  <Card withBorder p="xs">
                    <Group justify="space-between">
                      <Group>
                        <IconGripVertical size={16} />
                        <Text>{exercise.name}</Text>
                        <Text size="sm" c="dimmed">
                          {exercise.series}x
                          {exercise.reps > 0 ? exercise.reps : "F"} •{" "}
                          {exercise.restTime}s
                        </Text>
                        {exercise.advancedTechnique && (
                          <Text size="xs" c="blue">
                            ({exercise.advancedTechnique})
                          </Text>
                        )}
                      </Group>
                      <IconTrash
                        size={16}
                        color="red"
                        onClick={() => handleRemoveExercise(index)}
                        style={{ cursor: "pointer" }}
                      />
                    </Group>
                    {exercise.notes && (
                      <Text size="xs" mt="xs">
                        {exercise.notes}
                      </Text>
                    )}
                  </Card>
                </SortableItem>
              ))}
              {tempExercises.length === 0 && (
                <Text c="dimmed" ta="center">
                  Nenhum exercício adicionado ainda.
                </Text>
              )}
            </Stack>
          </SortableContext>
        </DndContext>
      </Stack>

      {/* Exercise Selection Part */}
      <Stack mt="xl">
        <Title order={5}>
          {t("dashboard.exerciseModal.addExercisesTitle")}
        </Title>
        <SimpleGrid cols={3} spacing="sm">
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
          <Select
            label={t("dashboard.exerciseModal.subgroupLabel")}
            placeholder={t("dashboard.exerciseModal.subgroupPlaceholder")}
            data={["Cabo", "Peso corporal", "Barra", "Máquina", "Halteres"]}
            value={filters.subMuscleGroup}
            onChange={(value) =>
              setFilters({ ...filters, subMuscleGroup: value || "" })
            }
            clearable
          />
          <Select
            label={t("dashboard.exerciseModal.equipmentLabel")}
            placeholder={t("dashboard.exerciseModal.equipmentPlaceholder")}
            data={["Cabo", "Peso corporal", "Barra", "Máquina", "Halteres"]}
            value={filters.equipment}
            onChange={(value) =>
              setFilters({ ...filters, equipment: value || "" })
            }
            clearable
          />
        </SimpleGrid>
        <TextInput
          placeholder={t("dashboard.exerciseModal.searchPlaceholder")}
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.currentTarget.value })
          }
        />
        <Group>
          <Button
            variant={filters.favorite ? "filled" : "light"}
            onClick={() =>
              setFilters({ ...filters, favorite: !filters.favorite })
            }
          >
            <Text size="sm">{t("common.favorites")}</Text>
          </Button>
        </Group>
        <Card
          withBorder
          padding="sm"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <Stack gap="xs">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} withBorder padding="xs">
                <Group justify="space-between">
                  <Text size="sm">{exercise.name}</Text>
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
            ))}
          </Stack>
        </Card>
        <SimpleGrid cols={3} spacing="sm">
          <NumberInput
            label={t("common.series")}
            placeholder="Ex: 3"
            value={exerciseDetails.series}
            onChange={(value) =>
              setExerciseDetails({ ...exerciseDetails, series: String(value) })
            }
            min={1}
            allowDecimal={false}
            required
            error={
              showErrors && !exerciseDetails.series
                ? t("common.required")
                : undefined
            }
          />
          <NumberInput
            label={t("common.reps")}
            placeholder="Ex: 12"
            value={exerciseDetails.reps}
            onChange={(value) =>
              setExerciseDetails({ ...exerciseDetails, reps: String(value) })
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
            mt="25px"
          >
            {t("common.untilFailure")}
          </Button>
        </SimpleGrid>
        <SimpleGrid cols={2} spacing="sm">
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
            required
            error={
              showErrors && !exerciseDetails.restTime
                ? t("common.required")
                : undefined
            }
          />
        </SimpleGrid>
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
          minRows={2}
        />
        {showErrors && fieldsError && (
          <Text color="red" size="sm">
            {fieldsError}
          </Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleModalClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSaveChanges}>{t("common.saveModel")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
