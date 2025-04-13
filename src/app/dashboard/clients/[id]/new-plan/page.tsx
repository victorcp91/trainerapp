"use client";

import { Fragment, useEffect } from "react";
import {
  Card,
  Text,
  Group,
  Stack,
  Divider,
  Button,
  Modal,
  Select,
  Textarea,
  SimpleGrid,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { DateInput, Calendar, DatesProvider } from "@mantine/dates"; // adicionado Calendar
import { useState } from "react";
import { eachDayOfInterval, format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import "dayjs/locale/pt-br"; // Adicionado para formatação de datas em português
import {
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconClock,
  IconBell,
  IconHeart,
  IconAlertCircle,
  IconPlus, // adição: ícone para adicionar exercício
  IconTrash, // adição: ícone para remover exercício da lista
} from "@tabler/icons-react"; // Importar ícones
import { withAuth } from "@/utils/withAuth";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Exercise {
  name: string;
  series: number;
  reps: number;
  advancedTechnique: string;
  notes: string;
  restTime?: number;
}

function SortableItem({
  id,
  children,
}: {
  id: number | string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function NewPlanPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [trainingDays, setTrainingDays] = useState<
    { date: Date; exercises: Exercise[] }[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [exerciseModalOpened, setExerciseModalOpened] = useState(false);
  const [replicateModalOpened, setReplicateModalOpened] = useState(false);
  const [publishModalOpened, setPublishModalOpened] = useState(false); // Estado para o modal de confirmação
  const [filters, setFilters] = useState({
    muscleGroup: "",
    subMuscleGroup: "",
    equipment: "",
    search: "",
    favorite: false,
  });
  const [selectedReplicationDates, setSelectedReplicationDates] = useState<
    Date[]
  >([]);
  const [replicationOption, setReplicationOption] = useState<string | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState({
    series: "",
    reps: "",
    advancedTechnique: "",
    notes: "",
    restTime: "",
  });
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]); // Estado para exercícios favoritos
  const [untilFailure, setUntilFailure] = useState(false); // Estado para "Até a falha"
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<
    number | null
  >(null); // Índice do exercício em edição
  const [selectedTrainingType, setSelectedTrainingType] = useState<
    string | null
  >(null); // Estado para o tipo de treino
  const [fieldsError, setFieldsError] = useState<string>("");
  const [showErrors, setShowErrors] = useState(false); // Novo estado para controle de erros
  const [tempExercises, setTempExercises] = useState<Exercise[]>([]); // Estado para manter as alterações no modal

  const toggleFavorite = (exerciseName: string) => {
    setFavoriteExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((name) => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      const days = eachDayOfInterval({ start, end }).map((date) => ({
        date,
        exercises: [],
      }));
      setTrainingDays(days);
    }
  };

  const openExerciseModal = (
    day: Date,
    editIndex: number | null = null,
    exercise?: Exercise
  ) => {
    setSelectedDay(day);
    const dayData = trainingDays.find(
      (d) => d.date.getTime() === day.getTime()
    );
    setTempExercises(dayData ? [...dayData.exercises] : []);
    setEditingExerciseIndex(editIndex);
    if (exercise) {
      setExerciseDetails({
        series: String(exercise.series),
        reps: String(exercise.reps),
        advancedTechnique: exercise.advancedTechnique,
        notes: exercise.notes,
        restTime: String(exercise.restTime || 0),
      });
    } else {
      setExerciseDetails({
        series: "",
        reps: "",
        advancedTechnique: "",
        notes: "",
        restTime: "",
      });
    }
    setShowErrors(false);
    setExerciseModalOpened(true);
  };

  const handleDirectAddExercise = (exerciseName: string) => {
    if (!selectedDay) return;
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
    setTempExercises((prev) => [
      ...prev,
      {
        name: exerciseName,
        series: Number(exerciseDetails.series),
        reps: Number(exerciseDetails.reps),
        advancedTechnique: exerciseDetails.advancedTechnique,
        notes: exerciseDetails.notes,
        restTime: Number(exerciseDetails.restTime),
      },
    ]);
  };

  const handleDeleteExerciseInModal = (index: number) => {
    setTempExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModalSave = () => {
    if (!selectedDay) return;
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
    setTempExercises([]);
    setEditingExerciseIndex(null);
  };

  const handleReplicateTraining = () => {
    if (!selectedDay) return;
    setTrainingDays((prev) => {
      const sourceDay = prev.find(
        (day) => day.date.getTime() === selectedDay.getTime()
      );
      if (!sourceDay) return prev;
      return prev.map((day) => {
        let newExercises = [...day.exercises];
        if (
          replicationOption &&
          day.date.getTime() !== sourceDay.date.getTime()
        ) {
          const daysDiff = differenceInDays(day.date, selectedDay);
          if (
            (replicationOption === "Toda semana" &&
              daysDiff % 7 === 0 &&
              daysDiff > 0) ||
            (replicationOption !== "Toda semana" &&
              daysDiff %
                parseInt(replicationOption.match(/\d+/)?.[0] || "0", 10) ===
                0 &&
              daysDiff > 0)
          ) {
            newExercises = [...newExercises, ...sourceDay.exercises];
          }
        }
        const isSelectedInCalendar = selectedReplicationDates.some(
          (d) => d.toDateString() === day.date.toDateString()
        );
        if (
          isSelectedInCalendar &&
          day.date.getTime() !== sourceDay.date.getTime()
        ) {
          newExercises = [...newExercises, ...sourceDay.exercises];
        }
        return { ...day, exercises: newExercises };
      });
    });
    setReplicationOption(null);
    setSelectedReplicationDates([]);
    setReplicateModalOpened(false);
  };

  const handleReplicateWeek = (startDay: Date, replicateToEnd: boolean) => {
    setTrainingDays((prev) => {
      const startIndex = prev.findIndex(
        (day) => day.date.getTime() === startDay.getTime()
      );
      if (startIndex === -1) return prev;

      const weekToReplicate = prev.slice(startIndex, startIndex + 7);
      const newTrainingDays = [...prev];

      for (let i = startIndex + 7; i < newTrainingDays.length; i += 7) {
        if (!replicateToEnd && i >= startIndex + 14) break;

        weekToReplicate.forEach((day, offset) => {
          if (newTrainingDays[i + offset]) {
            newTrainingDays[i + offset].exercises = [
              ...newTrainingDays[i + offset].exercises,
              ...day.exercises,
            ];
          }
        });
      }

      return newTrainingDays;
    });
  };

  const handlePublish = () => {
    console.log("Treino publicado");
    setPublishModalOpened(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempExercises((exercises) =>
        arrayMove(exercises, Number(active.id), Number(over.id))
      );
    }
  };

  const filteredExercises = [
    {
      name: "Remada Sentada",
      group: "Costas",
      subGroup: "Cabo",
      equipment: "Cabo",
    },
    {
      name: "Barra Fixa",
      group: "Costas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      name: "Levantamento Terra",
      group: "Costas",
      subGroup: "Barra",
      equipment: "Barra",
    },
    {
      name: "Agachamento",
      group: "Pernas",
      subGroup: "Barra",
      equipment: "Barra",
    },
    {
      name: "Leg Press",
      group: "Pernas",
      subGroup: "Máquina",
      equipment: "Máquina",
    },
    {
      name: "Avanço",
      group: "Pernas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      name: "Rosca Direta",
      group: "Braços",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Extensão de Tríceps",
      group: "Braços",
      subGroup: "Cabo",
      equipment: "Cabo",
    },
    {
      name: "Desenvolvimento de Ombro",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Elevação Lateral",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Prancha",
      group: "Core",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
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
      (!filters.favorite || favoriteExercises.includes(exercise.name))
  );

  const availableDays = ["segunda-feira", "quarta-feira", "sexta-feira"]; // Dias disponíveis

  return (
    <DatesProvider settings={{ locale: "pt-br" }}>
      <Stack>
        <Text size="xl">Nova Série</Text>
        <Divider my="sm" />
        <Card shadow="sm" padding="lg">
          <Text size="md">Informações de Treino</Text>
          <Divider my="sm" />
          <Group align="flex-start" style={{ alignItems: "stretch" }}>
            <Stack style={{ flex: 1 }}>
              <Group>
                <IconCalendar size={20} />
                <Text size="sm">
                  <strong>Dias disponíveis:</strong> Segunda-feira,
                  Quarta-feira, Sexta-feira
                </Text>
              </Group>
              <Group>
                <IconClock size={20} />
                <Text size="sm">
                  <strong>Tempo por treino:</strong> 1 hora
                </Text>
              </Group>
              <Group>
                <IconBell size={20} />
                <Text size="sm">
                  <strong>Equipamento:</strong> Pesos livres
                </Text>
              </Group>
            </Stack>
            <Stack style={{ flex: 1 }}>
              <Group>
                <IconStar size={20} />
                <Text size="sm">
                  <strong>Foco:</strong> Peitoral e Costas
                </Text>
              </Group>
              <Group>
                <IconHeart size={20} />
                <Text size="sm">
                  <strong>Cardio:</strong> Esteira, Bicicleta
                </Text>
              </Group>
              <Group>
                <IconAlertCircle size={20} />
                <Text size="sm">
                  <strong>Restrições:</strong> Nenhuma
                </Text>
              </Group>
            </Stack>
          </Group>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text size="md">Informações da Série</Text>
          <Divider my="sm" />
          <Stack>
            <Select
              label="Tipo de Treino"
              placeholder="Selecione o tipo"
              data={[
                "Hipertrofia",
                "Emagrecimento",
                "Força",
                "Resistência muscular",
                "Condicionamento físico geral",
              ]}
              value={selectedTrainingType}
              onChange={setSelectedTrainingType} // Atualiza o estado do tipo de treino
            />
            <Group grow>
              <DateInput
                locale="pt-BR" // alterado para string "pt-BR" para evitar erro
                label="Data de Início"
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  handleDateChange(date, endDate);
                }}
              />
              <DateInput
                locale="pt-BR" // alterado para string "pt-BR" para evitar erro
                label="Data de Expiração"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  handleDateChange(startDate, date);
                }}
              />
            </Group>
            <Textarea
              label="Observações"
              placeholder="Adicione observações sobre o treino"
            />
            <Group mt="md">
              <Button
                variant="outline"
                c="blue"
                leftSection={<IconStar />}
                onClick={() => console.log("Rascunho salvo")}
              >
                Salvar Rascunho
              </Button>
              <Button
                variant="filled"
                c="green"
                leftSection={<IconHeart />}
                onClick={() => setPublishModalOpened(true)} // Abre o modal de confirmação
                disabled={!startDate || !endDate || !selectedTrainingType} // Valida os campos obrigatórios e o tipo de treino
              >
                Publicar
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Modal de confirmação de publicação */}
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

        {/* Cards para os dias da semana */}
        <SimpleGrid cols={2} spacing="lg">
          {trainingDays.map(({ date, exercises }, index) => {
            const isAvailableDay = availableDays.includes(
              format(date, "EEEE", { locale: ptBR })
            );

            return (
              <Fragment key={date.toISOString()}>
                <Card
                  key={date.toISOString()}
                  shadow="sm"
                  padding="lg"
                  style={{
                    border: isAvailableDay
                      ? "2px solid #4caf50"
                      : "1px solid #ccc", // Borda verde para dias disponíveis
                    backgroundColor: isAvailableDay ? "#e8f5e9" : "white", // Fundo verde claro para dias disponíveis
                  }}
                >
                  <Stack>
                    <Group align="center" justify="space-between">
                      <Text size="md">
                        {format(date, "EEEE", { locale: ptBR })}
                      </Text>
                      <Group>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          c="blue"
                          onClick={() => {
                            setSelectedDay(date);
                            setReplicateModalOpened(true);
                          }}
                          disabled={exercises.length === 0} // Desabilitar se não houver exercícios
                        >
                          Replicar Treino
                        </Button>
                        <Text size="sm" c="dimmed">
                          {format(date, "dd/MM/yyyy")}
                        </Text>
                      </Group>
                    </Group>
                    <Divider my="sm" />
                    <Stack>
                      {exercises.map((exercise, index) => (
                        <Group
                          key={index}
                          justify="space-between"
                          align="center"
                        >
                          <Stack gap={0}>
                            <Text size="sm">{exercise.name}</Text>
                            <Text size="sm" c="dimmed">
                              {exercise.series} x{" "}
                              {exercise.reps === 0 ? "falha" : exercise.reps}
                              {!!exercise.advancedTechnique && (
                                <> - {exercise.advancedTechnique}</>
                              )}
                            </Text>
                          </Stack>
                        </Group>
                      ))}
                    </Stack>
                    <Button
                      variant="light"
                      c="green" // cor ajustada para ação de adicionar
                      onClick={() => openExerciseModal(date)}
                    >
                      Adicionar Exercício
                    </Button>
                  </Stack>
                </Card>

                {(index + 1) % 7 === 0 && index + 1 < trainingDays.length && (
                  <Card
                    key={`week-${index}`}
                    shadow="sm"
                    padding="lg"
                    style={{
                      border: "2px dashed #4caf50",
                    }}
                  >
                    <Stack>
                      <Text size="md">
                        Opções para a Semana {Math.floor(index / 7) + 1}
                      </Text>
                      <Group grow>
                        <Button
                          variant="outline"
                          c="blue"
                          onClick={() =>
                            handleReplicateWeek(
                              trainingDays[index - 6].date,
                              false
                            )
                          }
                        >
                          Replicar para a Próxima Semana
                        </Button>
                        <Button
                          variant="filled"
                          c="green"
                          onClick={() =>
                            handleReplicateWeek(
                              trainingDays[index - 6].date,
                              true
                            )
                          }
                        >
                          Replicar para Todas as Semanas
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                )}
              </Fragment>
            );
          })}
        </SimpleGrid>

        {/* Modal para adicionar/editar exercícios */}
        <Modal
          opened={exerciseModalOpened}
          onClose={handleModalClose}
          title="Adicionar Exercício"
          closeOnClickOutside
          size="100%"
        >
          <Group align="center" grow style={{ height: "80vh" }}>
            {/* Nova coluna: Lista do Treino */}
            <Stack
              style={{
                flex: 1,
                borderRight: "1px solid #ccc",
                paddingRight: "10px",
                overflowY: "auto",
                height: "100%",
                backgroundColor: "#f7f7f7",
              }}
            >
              <Text size="md">Lista do Treino</Text>
              {selectedDay ? (
                tempExercises.length ? (
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
                                marginBottom: "8px",
                                position: "relative",
                                minHeight: "90px",
                              }}
                            >
                              <Text size="sm">{ex.name}</Text>
                              <Text size="xs" c="dimmed">
                                {ex.series} x{" "}
                                {ex.reps === 0 ? "falha" : ex.reps}
                                {!!ex.advancedTechnique && (
                                  <> - {ex.advancedTechnique}</>
                                )}
                              </Text>
                              {matchedExercise && (
                                <Text size="xs" c="dimmed">
                                  {matchedExercise.group} -{" "}
                                  {matchedExercise.subGroup}
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
                )
              ) : (
                <Text size="sm" c="dimmed">
                  Selecione um dia
                </Text>
              )}
            </Stack>
            {/* Coluna com filtros e lista de exercícios */}
            <Stack
              mt="xs"
              style={{ maxWidth: "50%", height: "100%", overflow: "hidden" }}
            >
              <Group grow mb="md">
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
                  data={[
                    "Peitoral superior",
                    "Halteres",
                    "Cabo",
                    "Peso corporal",
                  ]}
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
                <label
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
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
                  {filteredExercises.map((exercise, index) => (
                    <Card
                      key={index}
                      shadow="sm"
                      padding="lg"
                      style={{
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() => handleDirectAddExercise(exercise.name)}
                    >
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(exercise.name);
                        }}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                      >
                        {favoriteExercises.includes(exercise.name) ? (
                          <IconStarFilled />
                        ) : (
                          <IconStar />
                        )}
                      </Button>
                      <Text size="sm">{exercise.name}</Text>
                      <Text size="xs" c="dimmed">
                        {exercise.group} - {exercise.subGroup}
                      </Text>
                      {/* Botão de adição do exercício */}
                      <Button
                        variant="subtle"
                        size="xs"
                        c="green" // cor ajustada para ação de adicionar
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectAddExercise(exercise.name);
                        }}
                        style={{
                          position: "absolute",
                          bottom: "5px",
                          right: "5px",
                        }}
                      >
                        <IconPlus />
                      </Button>
                    </Card>
                  ))}
                </SimpleGrid>
              </div>
            </Stack>
            {/* Formulário de adição de exercícios */}
            <Stack style={{ flex: 1 }}>
              <Group grow>
                <NumberInput
                  label="Séries*" // campo obrigatório
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
                <Button
                  variant="filled"
                  c="green"
                  onClick={handleModalSave}
                  disabled={
                    exerciseDetails.series === "" ||
                    (!untilFailure && exerciseDetails.reps === "") ||
                    exerciseDetails.restTime === ""
                  }
                >
                  Salvar Alterações
                </Button>
              </Group>
              {fieldsError && (
                <Text size="xs" color="red">
                  {fieldsError}
                </Text>
              )}
            </Stack>
          </Group>
        </Modal>

        {/* Modal para replicar treinos */}
        <Modal
          opened={replicateModalOpened}
          onClose={() => {
            setReplicateModalOpened(false);
            setSelectedReplicationDates([]);
            setReplicationOption(null);
          }}
          title="Replicar Treino"
          closeOnClickOutside
        >
          <Group>
            <Stack>
              <Group style={{ flexWrap: "wrap" }}>
                {[
                  "A cada 2 dias",
                  "A cada 3 dias",
                  "A cada 4 dias",
                  "A cada 5 dias",
                  "A cada 6 dias",
                  "Toda semana",
                ].map((label, index) => (
                  <Button
                    key={index}
                    variant={replicationOption === label ? "filled" : "outline"}
                    c={replicationOption === label ? "violet" : "gray"} // cores ajustadas para melhor descrever ações
                    onClick={() => setReplicationOption(label)}
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
                locale="pt-BR" // alterado para string "pt-BR" para evitar erro
                minDate={startDate}
                maxDate={endDate}
                __onDayClick={(event, day: Date) => toggleReplicationDate(day)}
                renderDay={(date) => {
                  const isSelected = selectedReplicationDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );
                  return (
                    <div
                      style={{
                        backgroundColor: isSelected ? "#4caf50" : undefined,
                        color: isSelected ? "white" : "inherit",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {format(date, "d")}
                    </div>
                  );
                }}
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
            onClick={handleReplicateTraining}
            disabled={
              !selectedDay ||
              (!replicationOption && selectedReplicationDates.length === 0)
            }
          >
            Confirmar Replicação
          </Button>
        </Modal>
      </Stack>
    </DatesProvider>
  );
}

export default withAuth(NewPlanPage, true);
