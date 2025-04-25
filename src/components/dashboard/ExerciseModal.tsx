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
      setFieldsError("Nome do modelo é obrigatório.");
      setShowErrors(true);
      return;
    }
    setFieldsError("");
    setShowErrors(false);
    handleModalSave({
      name: modelName,
      description: modelDescription,
      exercises: tempExercises,
    });
  };

  return (
    <Modal
      opened={modalOpened}
      onClose={handleModalClose}
      title={
        editingModel ? "Editar Modelo de Treino" : "Criar Modelo de Treino"
      }
      size="xl"
    >
      <Stack>
        <TextInput
          label="Nome do Modelo"
          placeholder="Ex: Treino de Peito e Tríceps"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          required
          error={showErrors && !modelName ? "Nome obrigatório" : undefined}
        />
        <Textarea
          label="Descrição do Modelo (Opcional)"
          placeholder="Ex: Foco em hipertrofia, 3x por semana"
          value={modelDescription}
          onChange={(e) => setModelDescription(e.target.value)}
        />
        <Group grow>
          <Select
            placeholder="Grupo Muscular"
            data={["Peito", "Costas", "Pernas"]}
            value={filters.muscleGroup || ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                muscleGroup: value || "",
              }))
            }
            clearable
          />
          <Select
            placeholder="Subgrupo Muscular"
            data={["Peitoral superior", "Halteres", "Cabo", "Peso corporal"]}
            value={filters.subMuscleGroup || ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                subMuscleGroup: value || "",
              }))
            }
            clearable
          />
          <Select
            placeholder="Equipamento"
            data={["Barra", "Halteres", "Cabo", "Peso corporal"]}
            value={filters.equipment || ""}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, equipment: value || "" }))
            }
            clearable
          />
        </Group>
        <Group>
          <TextInput
            placeholder="Buscar exercício"
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.currentTarget.value,
              }))
            }
            style={{ flex: 1 }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              checked={filters.favorite || false}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  favorite: e.target.checked,
                }))
              }
            />
            <Text size="sm">Favoritos</Text>
          </label>
        </Group>
        <div
          style={{
            overflowY: "auto",
            height: "calc(100% - 150px)",
            paddingRight: "10px",
          }}
        >
          <SimpleGrid cols={2} spacing="md" mb="md">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                shadow="sm"
                padding="lg"
                style={{
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(exercise.id);
                  }}
                  c="yellow"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "0px",
                  }}
                >
                  {favoriteExercises.includes(exercise.id) ? (
                    <IconStarFilled size={20} />
                  ) : (
                    <IconStar size={20} />
                  )}
                </Button>
                <Text size="sm">{exercise.name}</Text>
                <Text size="xs" c="dimmed">
                  {exercise.group} - {exercise.subGroup}
                </Text>
                <Button
                  variant="subtle"
                  size="xs"
                  c="green"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirectAddExercise(exercise.id);
                  }}
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "0px",
                  }}
                >
                  <IconPlus size={20} />
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </div>
        <Stack
          style={{
            flex: 1,
            borderRight: "1px solid #ccc",
            padding: "10px",
            overflowY: "auto",
            height: "100%",
            backgroundColor: "#f7f7f7",
          }}
        >
          {tempExercises.length ? (
            <DndContext
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={tempExercises.map((_, index) => index)}
                strategy={verticalListSortingStrategy}
              >
                {tempExercises.map((ex, index) => {
                  const matchedExercise = filteredExercises.find(
                    (e) => e.name === ex.name
                  );
                  return (
                    <SortableItem key={index} id={index}>
                      <Card
                        key={index}
                        shadow="sm"
                        padding="lg"
                        style={{
                          border: "1px solid #ccc",
                          position: "relative",
                          minHeight: "90px",
                          cursor: "grab",
                        }}
                      >
                        <Button
                          variant="subtle"
                          c="red"
                          size="xs"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExercise(index);
                          }}
                          style={{
                            position: "absolute",
                            right: "0px",
                            bottom: "10px",
                            zIndex: 1,
                            pointerEvents: "auto",
                          }}
                        >
                          <IconTrash size={16} />
                        </Button>
                        <IconGripVertical
                          size={16}
                          style={{
                            position: "absolute",
                            right: "15px",
                            top: "15px",
                          }}
                        />
                        <Text
                          size="sm"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {ex.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {ex.series} x {ex.reps === 0 ? "falha" : ex.reps}
                          {!!ex.advancedTechnique && (
                            <> - {ex.advancedTechnique}</>
                          )}
                          {ex.restTime ? ` | Descanso: ${ex.restTime}s` : ""}
                        </Text>
                        {matchedExercise && (
                          <Text size="xs" c="dimmed">
                            {matchedExercise.group} - {matchedExercise.subGroup}
                          </Text>
                        )}
                      </Card>
                    </SortableItem>
                  );
                })}
              </SortableContext>
            </DndContext>
          ) : (
            <Text size="sm" c="dimmed">
              Nenhum exercício adicionado.
            </Text>
          )}
        </Stack>
        <Stack style={{ flex: 1 }}>
          <Group grow>
            <NumberInput
              label="Séries*"
              placeholder=""
              value={exerciseDetails.series}
              onChange={(value) =>
                setExerciseDetails((prev) => ({
                  ...prev,
                  series: value === null ? "" : String(value),
                }))
              }
              error={
                showErrors && exerciseDetails.series === ""
                  ? "Campo obrigatório"
                  : null
              }
            />
            <NumberInput
              label="Repetições*"
              placeholder=""
              value={exerciseDetails.reps}
              onChange={(value) =>
                setExerciseDetails((prev) => ({
                  ...prev,
                  reps: value === null ? "" : String(value),
                }))
              }
              disabled={untilFailure}
              error={
                !untilFailure && showErrors && exerciseDetails.reps === ""
                  ? "Campo obrigatório"
                  : null
              }
            />
          </Group>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "5px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <input
                type="checkbox"
                checked={untilFailure}
                onChange={(e) => {
                  setUntilFailure(e.target.checked);
                  if (e.target.checked) {
                    setExerciseDetails((prev) => ({ ...prev, reps: "" }));
                  }
                }}
              />
              <Text size="sm" mr="xl">
                Até a falha
              </Text>
            </label>
          </div>
          <Group grow>
            <NumberInput
              label="Descanso (segundos)*"
              placeholder="0"
              value={
                exerciseDetails.restTime === ""
                  ? 0
                  : Number(exerciseDetails.restTime)
              }
              onChange={(value) =>
                setExerciseDetails((prev) => ({
                  ...prev,
                  restTime: value === null ? "" : String(value),
                }))
              }
              min={0}
              error={
                showErrors && exerciseDetails.restTime === ""
                  ? "Campo obrigatório"
                  : null
              }
            />
          </Group>
          <Group grow>
            <Select
              label="Técnica Avançada"
              placeholder="Selecione"
              data={["Drop set", "Rest-pause", "Super set"]}
              value={exerciseDetails.advancedTechnique || ""}
              onChange={(value) =>
                setExerciseDetails((prev) => ({
                  ...prev,
                  advancedTechnique: value || "",
                }))
              }
            />
          </Group>
          <Textarea
            label="Notas"
            placeholder="Adicione notas (opcional)"
            value={exerciseDetails.notes ?? ""}
            onChange={(e) =>
              setExerciseDetails((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
          />
          <Group mt="md">
            <Button variant="outline" onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button onClick={onSaveChanges} mt="md">
              {editingModel ? "Salvar Alterações" : "Criar Modelo"}
            </Button>
          </Group>
          {fieldsError && (
            <Text color="red" size="sm" mt="xs">
              {fieldsError}
            </Text>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
}
