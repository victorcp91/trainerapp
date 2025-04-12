"use client";

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
import { DateInput } from "@mantine/dates";
import { useState } from "react";
import { eachDayOfInterval, format, differenceInDays } from "date-fns";
import {
  IconStar,
  IconStarFilled,
  IconCalendar,
  IconClock,
  IconBell,
  IconHeart,
  IconAlertCircle,
} from "@tabler/icons-react"; // Importar ícones

export default function NewPlanPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [trainingDays, setTrainingDays] = useState<
    {
      date: Date;
      exercises: {
        name: string;
        series: number;
        reps: number;
        advancedTechnique: string;
        notes: string;
        restTime?: number;
      }[];
    }[]
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
  const [replicationOption, setReplicationOption] = useState<string | null>(
    null
  );
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState({
    series: 0,
    reps: 0,
    advancedTechnique: "",
    notes: "",
    restTime: 0,
  });
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>([]); // Estado para exercícios favoritos
  const [untilFailure, setUntilFailure] = useState(false); // Estado para "Até a falha"
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<
    number | null
  >(null); // Índice do exercício em edição
  const [selectedTrainingType, setSelectedTrainingType] = useState<
    string | null
  >(null); // Estado para o tipo de treino

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

  const handleAddExercise = () => {
    if (selectedDay && selectedExercise) {
      setTrainingDays((prev) =>
        prev.map((day) =>
          day.date.getTime() === selectedDay.getTime()
            ? {
                ...day,
                exercises: [
                  ...day.exercises,
                  { name: selectedExercise, ...exerciseDetails },
                ],
              }
            : day
        )
      );
      setSelectedExercise(null);
      setExerciseDetails({
        series: 0,
        reps: 0,
        advancedTechnique: "",
        notes: "",
        restTime: 0,
      });
      setExerciseModalOpened(false);
    }
  };

  const handleEditExercise = () => {
    if (selectedDay !== null && editingExerciseIndex !== null) {
      setTrainingDays((prev) =>
        prev.map((day) =>
          day.date.getTime() === selectedDay.getTime()
            ? {
                ...day,
                exercises: day.exercises.map((exercise, index) =>
                  index === editingExerciseIndex
                    ? { ...exerciseDetails, name: exercise.name }
                    : exercise
                ),
              }
            : day
        )
      );
      setEditingExerciseIndex(null);
      setExerciseModalOpened(false);
      setExerciseDetails({
        series: 0,
        reps: 0,
        advancedTechnique: "",
        notes: "",
        restTime: 0,
      });
    }
  };

  const handleDeleteExercise = (day: Date, index: number) => {
    setTrainingDays((prev) =>
      prev.map((trainingDay) =>
        trainingDay.date.getTime() === day.getTime()
          ? {
              ...trainingDay,
              exercises: trainingDay.exercises.filter((_, i) => i !== index),
            }
          : trainingDay
      )
    );
  };

  const handleReplicateTraining = () => {
    if (selectedDay && replicationOption) {
      const interval = parseInt(replicationOption.match(/\d+/)?.[0] || "0", 10);
      setTrainingDays((prev) => {
        const sourceDay = prev.find(
          (day) => day.date.getTime() === selectedDay.getTime()
        );
        if (!sourceDay) return prev;

        return prev.map((day) => {
          const daysDifference = differenceInDays(day.date, selectedDay);
          if (
            (replicationOption === "Toda semana" &&
              daysDifference % 7 === 0 &&
              daysDifference > 0) ||
            (interval > 0 &&
              daysDifference % interval === 0 &&
              daysDifference > 0)
          ) {
            return {
              ...day,
              exercises: [...day.exercises, ...sourceDay.exercises],
            };
          }
          return day;
        });
      });
      setReplicationOption(null);
      setReplicateModalOpened(false);
    }
  };

  const handlePublish = () => {
    console.log("Treino publicado");
    setPublishModalOpened(false);
  };

  const filteredExercises = [
    {
      name: "Bench Press",
      group: "Peito",
      subGroup: "Peitoral superior",
      equipment: "Barra",
    },
    {
      name: "Incline Bench Press",
      group: "Peito",
      subGroup: "Peitoral superior",
      equipment: "Barra",
    },
    {
      name: "Chest Fly",
      group: "Peito",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Seated Row",
      group: "Costas",
      subGroup: "Cabo",
      equipment: "Cabo",
    },
    {
      name: "Pull-Up",
      group: "Costas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      name: "Deadlift",
      group: "Costas",
      subGroup: "Barra",
      equipment: "Barra",
    },
    { name: "Squat", group: "Pernas", subGroup: "Barra", equipment: "Barra" },
    {
      name: "Leg Press",
      group: "Pernas",
      subGroup: "Máquina",
      equipment: "Máquina",
    },
    {
      name: "Lunges",
      group: "Pernas",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      name: "Bicep Curl",
      group: "Braços",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Tricep Extension",
      group: "Braços",
      subGroup: "Cabo",
      equipment: "Cabo",
    },
    {
      name: "Shoulder Press",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Lateral Raise",
      group: "Ombros",
      subGroup: "Halteres",
      equipment: "Halteres",
    },
    {
      name: "Plank",
      group: "Core",
      subGroup: "Peso corporal",
      equipment: "Peso corporal",
    },
    {
      name: "Russian Twist",
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

  const availableDays = ["Monday", "Wednesday", "Friday"]; // Dias disponíveis

  return (
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
                <strong>Dias disponíveis:</strong> Segunda, Quarta, Sexta
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
              label="Data de Início"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                handleDateChange(date, endDate);
              }}
            />
            <DateInput
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
          Nem todos os dias disponíveis apontados pelo cliente possuem treinos.
          Deseja continuar com a publicação?
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
        {trainingDays.map(({ date, exercises }) => {
          const isAvailableDay = availableDays.includes(
            format(date, "EEEE", { locale: undefined })
          );

          return (
            <Card
              key={date.toISOString()}
              shadow="sm"
              padding="lg"
              style={{
                border: isAvailableDay ? "2px solid #4caf50" : "1px solid #ccc", // Borda verde para dias disponíveis
                backgroundColor: isAvailableDay ? "#e8f5e9" : "white", // Fundo verde claro para dias disponíveis
              }}
            >
              <Stack>
                <Group align="center" justify="space-between">
                  <Text size="md">
                    {format(date, "EEEE", { locale: undefined })}
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
                    <Group key={index} justify="space-between" align="center">
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
                      <Group gap={0}>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          onClick={() => {
                            setSelectedDay(date);
                            setEditingExerciseIndex(index); // Define o índice do exercício em edição
                            setExerciseDetails({
                              ...exercise,
                              restTime: exercise.restTime || 0,
                            }); // Preenche os detalhes do exercício no modal
                            setExerciseModalOpened(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          c="red"
                          onClick={() => handleDeleteExercise(date, index)} // Chama a função de exclusão
                        >
                          Excluir
                        </Button>
                      </Group>
                    </Group>
                  ))}
                </Stack>
                <Button
                  variant="light"
                  onClick={() => {
                    setSelectedDay(date);
                    setExerciseModalOpened(true);
                  }}
                >
                  Adicionar Exercício
                </Button>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Modal para adicionar/editar exercícios */}
      <Modal
        opened={exerciseModalOpened}
        onClose={() => {
          setExerciseModalOpened(false);
          setSelectedExercise(null);
          setExerciseDetails({
            series: 0,
            reps: 0,
            advancedTechnique: "",
            notes: "",
            restTime: 0,
          });
          setEditingExerciseIndex(null);
        }}
        title="Adicionar Exercício"
        closeOnClickOutside
        size="90%"
      >
        <Group
          align="center"
          grow
          style={{
            height: "80vh",
          }}
        >
          <Stack
            mt="xs"
            style={{ maxWidth: "65%", height: "100%", overflow: "hidden" }}
          >
            <Group grow mb="md">
              <Select
                placeholder="Grupo Muscular"
                data={["Peito", "Costas", "Pernas"]}
                value={filters.muscleGroup || ""}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, muscleGroup: value || "" }))
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
                height: "calc(100% - 150px)", // Ajustar altura para rolagem
                paddingRight: "10px", // Adicionar espaço para evitar corte
              }}
            >
              <SimpleGrid cols={2} spacing="md" mb="md">
                {filteredExercises.map((exercise, index) => (
                  <Card
                    key={index}
                    shadow="sm"
                    padding="lg"
                    style={{
                      border:
                        selectedExercise === exercise.name
                          ? "2px solid #4caf50"
                          : "1px solid #ccc",
                      cursor: "pointer",
                      position: "relative", // Para posicionar o ícone
                    }}
                    onClick={() => setSelectedExercise(exercise.name)}
                  >
                    <Button
                      variant="subtle"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que o clique no botão selecione o card
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
                  </Card>
                ))}
              </SimpleGrid>
            </div>
          </Stack>

          {/* Formulário de adição de exercícios */}
          <Stack style={{ flex: 1 }}>
            <Group grow>
              <NumberInput
                label="Séries"
                value={exerciseDetails.series}
                onChange={(value) =>
                  setExerciseDetails((prev) => ({
                    ...prev,
                    series: typeof value === "number" ? value : prev.series,
                  }))
                }
              />
              <NumberInput
                label="Repetições"
                value={exerciseDetails.reps}
                onChange={(value) =>
                  setExerciseDetails((prev) => ({
                    ...prev,
                    reps: typeof value === "number" ? value : prev.reps,
                  }))
                }
                disabled={untilFailure} // Desabilitar se "Até a falha" estiver selecionado
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
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="checkbox"
                  checked={untilFailure}
                  onChange={(e) => {
                    setUntilFailure(e.target.checked);
                    if (e.target.checked) {
                      setExerciseDetails((prev) => ({ ...prev, reps: 0 })); // Resetar repetições
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
                label="Descanso: Minutos"
                value={Math.floor((exerciseDetails.restTime || 0) / 60)}
                onChange={(value) =>
                  setExerciseDetails((prev) => ({
                    ...prev,
                    restTime:
                      typeof value === "number"
                        ? value * 60 + ((prev.restTime || 0) % 60)
                        : prev.restTime,
                  }))
                }
                min={0}
              />
              <NumberInput
                label="Segundos"
                value={(exerciseDetails.restTime || 0) % 60}
                onChange={(value) =>
                  setExerciseDetails((prev) => ({
                    ...prev,
                    restTime:
                      typeof value === "number"
                        ? Math.floor((prev.restTime || 0) / 60) * 60 + value
                        : prev.restTime,
                  }))
                }
                min={0}
                max={59}
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
            <Button
              variant="filled"
              c="green"
              fullWidth
              mt="md"
              onClick={
                editingExerciseIndex !== null
                  ? handleEditExercise
                  : handleAddExercise
              } // Salva ou adiciona
              disabled={
                !selectedExercise ||
                exerciseDetails.series === 0 ||
                (!untilFailure && exerciseDetails.reps === 0)
              }
            >
              {editingExerciseIndex !== null
                ? "Salvar Alterações"
                : "Confirmar"}
            </Button>
          </Stack>
        </Group>
      </Modal>

      {/* Modal para replicar treinos */}
      <Modal
        opened={replicateModalOpened}
        onClose={() => {
          setReplicateModalOpened(false);
          setReplicationOption(null);
        }}
        title="Replicar Treino"
        closeOnClickOutside
      >
        <Divider my="sm" />
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
              c={replicationOption === label ? "blue" : "gray"}
              style={{ flex: "1 1 calc(33.33% - 10px)", margin: "5px" }}
              onClick={() => setReplicationOption(label)}
            >
              {label}
            </Button>
          ))}
        </Group>
        <Divider my="sm" />
        <Button
          variant="filled"
          c="green"
          fullWidth
          mt="md"
          onClick={handleReplicateTraining}
          disabled={!replicationOption}
        >
          Confirmar Replicação
        </Button>
      </Modal>
    </Stack>
  );
}
