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
  MultiSelect,
  TextInput,
} from "@mantine/core";
import { DateInput, Calendar, DatesProvider } from "@mantine/dates"; // adicionado Calendar
import { useState } from "react";
import { eachDayOfInterval, format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import "dayjs/locale/pt-br"; // Adicionado para formatação de datas em português
import {
  IconStar,
  IconCalendar,
  IconClock,
  IconBell,
  IconHeart,
  IconAlertCircle,
} from "@tabler/icons-react"; // Importar ícones
import { withAuth } from "@/utils/withAuth";

import { ExerciseModal } from "@/components/shared/ExerciseModal";

interface Exercise {
  name: string;
  series: number;
  reps: number;
  advancedTechnique: string;
  notes: string;
  restTime?: number;
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

  // Estado para modal de mover treino
  const [moveModalOpened, setMoveModalOpened] = useState(false);
  const [moveTargetDate, setMoveTargetDate] = useState<Date | null>(null);

  const [selectedReplicationDates, setSelectedReplicationDates] = useState<
    Date[]
  >([]);
  const [replicationOption, setReplicationOption] = useState<string | null>(
    null
  );
  const [editingExercises, setEditingExercises] = useState<Exercise[]>([]);
  const [selectedTrainingType, setSelectedTrainingType] = useState<
    string | null
  >(null);
  // Estado para série/modelo de série selecionado
  const [selectedSerieModel, setSelectedSerieModel] = useState<string | null>(
    null
  );

  // Novo estado para armazenar a seleção de treino/descanso para cada dia do plano
  const [dayAssignments, setDayAssignments] = useState<string[]>([]);

  // Estado para mensagem de erro ao buscar modelo de série
  const [serieModelError, setSerieModelError] = useState<string | null>(null);

  // Estado para controle de tentativa de busca sem datas
  const [triedSerieModelSearch, setTriedSerieModelSearch] = useState(false);

  // Estados para modal de seleção de série
  const [seriesModalOpened, setSeriesModalOpened] = useState(false);
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [seriesLevelFilter, setSeriesLevelFilter] = useState<string[]>([]);

  // Estado para modal de aplicação do modelo de série
  const [applySerieModalOpened, setApplySerieModalOpened] = useState(false);

  // Mock de sequência de treinos do modelo selecionado
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

  // Mock de séries/modelos de série
  const serieModels = [
    { value: "serie-1", label: "Série 1", level: "iniciante" },
    { value: "serie-2", label: "Série 2", level: "intermediario" },
    { value: "serie-3", label: "Série 3", level: "avancado" },
  ];

  const levels = [
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediario", label: "Intermediário" },
    { value: "avançado", label: "Avançado" },
  ];

  // Mock de modelos de treino
  const trainingModels = [
    {
      name: "Modelo de Força",
      description: "Treino focado em ganho de força muscular.",
      level: "iniciante",
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
      level: "intermediario",
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
      level: "avancado",
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

  const [addModelModalOpened, setAddModelModalOpened] = useState(false);
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [modelLevelFilter, setModelLevelFilter] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<
    (typeof trainingModels)[0] | null
  >(null);
  const [modelTargetDay, setModelTargetDay] = useState<Date | null>(null);

  const filteredModelsForModal = trainingModels.filter((model) => {
    const nameMatch = model.name
      .toLowerCase()
      .includes(modelSearchTerm.toLowerCase());
    const levelMatch =
      modelLevelFilter.length === 0 || modelLevelFilter.includes(model.level);
    return nameMatch && levelMatch;
  });

  // Filtro das séries
  const filteredSeriesModels = serieModels.filter(
    (serie) =>
      serie.label.toLowerCase().includes(seriesSearchTerm.toLowerCase()) &&
      (seriesLevelFilter.length === 0 ||
        seriesLevelFilter.includes(serie.level))
  );

  // Função para preencher automaticamente os 7 primeiros dias com os treinos do modelo
  const autoAssignTrainingsToFirstWeek = () => {
    if (!selectedSerieModel || trainingDays.length === 0) return;
    const trainings = serieModelTrainings[selectedSerieModel] || [];
    let treinoIdx = 0;
    // Só os primeiros 7 dias
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
    // Replicar para as semanas seguintes
    const fullAssignments = trainingDays.map(
      (_, idx) => firstWeekAssignments[idx % 7]
    );
    setDayAssignments(fullAssignments);
  };

  // Preenche automaticamente os seletores ao abrir o modal e quando mudar trainingDays/modelo/modal
  useEffect(() => {
    if (
      applySerieModalOpened &&
      selectedSerieModel &&
      trainingDays.length > 0
    ) {
      autoAssignTrainingsToFirstWeek();
    }
    // eslint-disable-next-line
  }, [applySerieModalOpened, selectedSerieModel, trainingDays.length]);

  // Função para adicionar série ao plano (mock)
  const handleAddSerieToPlan = (serieValue: string) => {
    setSelectedSerieModel(serieValue);
    setSeriesModalOpened(false);
    setSerieModelError(null);
    setApplySerieModalOpened(true);
  };

  // Função para aplicar o modelo de série nos dias do plano
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
    if (start && end) {
      const days = eachDayOfInterval({ start, end }).map((date) => ({
        date,
        exercises: [],
      }));
      setTrainingDays(days);
    }
  };

  const openExerciseModal = (day: Date) => {
    setSelectedDay(day);
    const dayData = trainingDays.find(
      (d) => d.date.getTime() === day.getTime()
    );
    setEditingExercises(dayData ? [...dayData.exercises] : []);
    setExerciseModalOpened(true);
  };

  const handleModalSave = (tempExercises: Exercise[]) => {
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

  // Função para mover treino para outra data
  const handleMoveTraining = () => {
    if (
      !selectedDay ||
      !moveTargetDate ||
      selectedDay.getTime() === moveTargetDate.getTime()
    )
      return;
    setTrainingDays((prev) => {
      const sourceDayIdx = prev.findIndex(
        (d) => d.date.getTime() === selectedDay.getTime()
      );
      const targetDayIdx = prev.findIndex(
        (d) => d.date.getTime() === moveTargetDate.getTime()
      );
      if (sourceDayIdx === -1 || targetDayIdx === -1) return prev;
      const sourceExercises = prev[sourceDayIdx].exercises;
      // Remove do dia de origem e adiciona no destino
      return prev.map((d, idx) => {
        if (idx === sourceDayIdx) return { ...d, exercises: [] };
        if (idx === targetDayIdx) return { ...d, exercises: sourceExercises };
        return d;
      });
    });
    setMoveModalOpened(false);
    setMoveTargetDate(null);
  };

  const handlePublish = () => {
    console.log("Treino publicado");
    setPublishModalOpened(false);
  };

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
                locale="pt-BR"
                label="Data de Início"
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  handleDateChange(date, endDate);
                  setTriedSerieModelSearch(false);
                }}
                error={
                  triedSerieModelSearch && !startDate
                    ? "Campo obrigatório"
                    : undefined
                }
                styles={
                  triedSerieModelSearch && !startDate
                    ? { input: { borderColor: "red" } }
                    : {}
                }
              />
              <DateInput
                locale="pt-BR"
                label="Data de Expiração"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  handleDateChange(startDate, date);
                  setTriedSerieModelSearch(false);
                }}
                error={
                  triedSerieModelSearch && !endDate
                    ? "Campo obrigatório"
                    : undefined
                }
                styles={
                  triedSerieModelSearch && !endDate
                    ? { input: { borderColor: "red" } }
                    : {}
                }
              />
            </Group>
            <Textarea
              label="Observações"
              placeholder="Adicione observações sobre o treino"
            />
            <Group mt="md" justify="space-between">
              <Button
                variant="outline"
                c="gray"
                onClick={() => {
                  if (!startDate || !endDate) {
                    setTriedSerieModelSearch(true);
                  } else {
                    setTriedSerieModelSearch(false);
                    setSeriesModalOpened(true);
                  }
                }}
              >
                Buscar e adicionar série do modelo
              </Button>
              <Group gap="lg">
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
                  onClick={() => setPublishModalOpened(true)}
                  disabled={!startDate || !endDate || !selectedTrainingType}
                >
                  Publicar
                </Button>
              </Group>
            </Group>
            {/* Exibe o modelo de série selecionado logo abaixo do grupo de botões */}
            {selectedSerieModel && (
              <div style={{ minWidth: 200 }}>
                <Text size="sm">
                  {
                    serieModels.find((s) => s.value === selectedSerieModel)
                      ?.label
                  }
                </Text>
                <Text size="xs" c="dimmed">
                  Nível:{" "}
                  {
                    levels.find(
                      (l) =>
                        l.value ===
                        serieModels.find((s) => s.value === selectedSerieModel)
                          ?.level
                    )?.label
                  }
                </Text>
              </div>
            )}
            {/* Exibe erro se necessário */}
            {serieModelError && (
              <Text size="xs" color="red">
                {serieModelError}
              </Text>
            )}
            {/* Modal de busca e filtro de séries */}
            <Modal
              opened={seriesModalOpened}
              onClose={() => setSeriesModalOpened(false)}
              title="Buscar série do modelo"
            >
              <TextInput
                placeholder="Buscar por nome da série"
                value={seriesSearchTerm}
                onChange={(e) => setSeriesSearchTerm(e.target.value)}
                mb="md"
              />
              <MultiSelect
                data={levels}
                value={seriesLevelFilter}
                onChange={setSeriesLevelFilter}
                placeholder="Filtrar por nível"
                clearable
                mb="md"
              />
              <Stack>
                {filteredSeriesModels.length === 0 && (
                  <Text size="sm" c="dimmed">
                    Nenhuma série encontrada.
                  </Text>
                )}
                {filteredSeriesModels.map((serie) => (
                  <Button
                    key={serie.value}
                    variant="light"
                    fullWidth
                    onClick={() => handleAddSerieToPlan(serie.value)}
                  >
                    {serie.label} (
                    {levels.find((l) => l.value === serie.level)?.label})
                  </Button>
                ))}
              </Stack>
            </Modal>
            {selectedSerieModel && (
              <Modal
                opened={applySerieModalOpened}
                onClose={() => setApplySerieModalOpened(false)}
                title="Aplicar modelo de série"
                size="lg"
              >
                <Stack>
                  {trainingDays.slice(0, 7).map((d, idx) => {
                    const dayName = format(d.date, "EEEE", { locale: ptBR });
                    const treinoOptions = [
                      ...(serieModelTrainings[selectedSerieModel]?.map(
                        (t) => t.name
                      ) || []),
                      "Descanso",
                    ];
                    return (
                      <Group key={d.date.toISOString()}>
                        <Text style={{ minWidth: 120 }}>
                          {dayName} ({format(d.date, "dd/MM")})
                        </Text>
                        <Select
                          data={treinoOptions.map((t) => ({
                            value: t,
                            label: t,
                          }))}
                          value={dayAssignments[idx] || ""}
                          onChange={(val) => {
                            setDayAssignments((prev) => {
                              const arr = [...prev];
                              arr[idx] = val || "Descanso";
                              return arr;
                            });
                          }}
                          style={{ minWidth: 180 }}
                        />
                      </Group>
                    );
                  })}
                  <Button
                    mt="md"
                    onClick={handleApplySerieToPlan}
                    color="green"
                  >
                    Aplicar ao plano
                  </Button>
                </Stack>
              </Modal>
            )}
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
                          style={
                            exercises.length === 0
                              ? { opacity: 0.5, pointerEvents: "none" }
                              : {}
                          }
                        >
                          Replicar Treino
                        </Button>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          c="orange"
                          onClick={() => {
                            setSelectedDay(date);
                            setMoveModalOpened(true);
                          }}
                          disabled={exercises.length === 0}
                          style={
                            exercises.length === 0
                              ? { opacity: 0.5, pointerEvents: "none" }
                              : {}
                          }
                        >
                          Mover Treino
                        </Button>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          c="red"
                          onClick={() => {
                            setTrainingDays((prev) =>
                              prev.map((day) =>
                                day.date.getTime() === date.getTime()
                                  ? { ...day, exercises: [] }
                                  : day
                              )
                            );
                          }}
                          disabled={exercises.length === 0}
                          style={
                            exercises.length === 0
                              ? { opacity: 0.5, pointerEvents: "none" }
                              : {}
                          }
                        >
                          Limpar Treino
                        </Button>
                        <Text size="sm" c="dimmed">
                          {format(date, "dd/MM/yyyy")}
                        </Text>
                      </Group>
                    </Group>
                    <Divider mt="sm" />
                    <Button
                      variant="outline"
                      color="blue"
                      onClick={() => {
                        setModelTargetDay(date);
                        setAddModelModalOpened(true);
                      }}
                    >
                      Adicionar Modelo de Treino
                    </Button>
                    <Stack style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {exercises.map((exercise, index) => {
                        return (
                          <Card
                            key={index}
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
                              {exercise.reps === 0 ? "falha" : exercise.reps}
                              {!!exercise.advancedTechnique && (
                                <> - {exercise.advancedTechnique}</>
                              )}
                              {exercise.restTime
                                ? ` | Descanso: ${exercise.restTime}s`
                                : ""}
                            </Text>
                          </Card>
                        );
                      })}
                    </Stack>
                    <Button
                      variant="light"
                      c="green" // cor ajustada para ação de adicionar
                      onClick={() => openExerciseModal(date)}
                    >
                      {exercises.length > 0 ? "Editar treino" : "Criar treino"}
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
                          disabled={trainingDays
                            .slice(index - 6, index + 1)
                            .every((day) => day.exercises.length === 0)}
                          style={
                            trainingDays
                              .slice(index - 6, index + 1)
                              .every((day) => day.exercises.length === 0)
                              ? { opacity: 0.5, pointerEvents: "none" }
                              : {}
                          }
                        >
                          Replicar para a Próxima Semana
                        </Button>
                        <Button
                          variant="filled"
                          onClick={() =>
                            handleReplicateWeek(
                              trainingDays[index - 6].date,
                              true
                            )
                          }
                          disabled={trainingDays
                            .slice(index - 6, index + 1)
                            .every((day) => day.exercises.length === 0)}
                          style={
                            trainingDays
                              .slice(index - 6, index + 1)
                              .every((day) => day.exercises.length === 0)
                              ? { opacity: 0.5, pointerEvents: "none" }
                              : {}
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

        <ExerciseModal
          handleModalClose={handleModalClose}
          handleModalSave={handleModalSave}
          modalOpened={exerciseModalOpened}
          editingExercises={editingExercises}
        />
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
                __onDayClick={() => {}}
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
        {/* Modal para mover treino */}
        <Modal
          opened={moveModalOpened}
          onClose={() => {
            setMoveModalOpened(false);
            setMoveTargetDate(null);
          }}
          title="Mover Treino"
          closeOnClickOutside
        >
          <Text size="sm" mb="sm">
            Selecione a data para onde deseja mover o treino. O treino será
            removido da data atual e adicionado à data escolhida.
          </Text>
          {startDate && endDate ? (
            <Calendar
              locale="pt-BR"
              minDate={startDate}
              maxDate={endDate}
              __onDayClick={() => {
                setMoveTargetDate(null);
              }}
              renderDay={(date) => {
                const isSelected =
                  moveTargetDate &&
                  moveTargetDate.toDateString() === date.toDateString();
                return (
                  <div
                    style={{
                      backgroundColor: isSelected ? "#ff9800" : undefined,
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
              Defina as datas de início e expiração para mover o treino.
            </Text>
          )}
          <Divider my="sm" />
          <Button
            variant="filled"
            c="orange"
            fullWidth
            mt="md"
            onClick={handleMoveTraining}
            disabled={
              !selectedDay ||
              !moveTargetDate ||
              (selectedDay &&
                moveTargetDate &&
                selectedDay.toDateString() === moveTargetDate.toDateString())
            }
          >
            Confirmar Movimentação
          </Button>
        </Modal>
        {/* Modal para adicionar modelo de treino */}
        <Modal
          opened={addModelModalOpened}
          onClose={() => {
            setAddModelModalOpened(false);
            setModelSearchTerm("");
            setModelLevelFilter([]);
            setSelectedModel(null);
            setModelTargetDay(null);
          }}
          title="Adicionar Modelo de Treino ao Dia"
        >
          <TextInput
            placeholder="Buscar por nome do modelo"
            value={modelSearchTerm}
            onChange={(e) => setModelSearchTerm(e.target.value)}
            mb="md"
          />
          <MultiSelect
            data={levels}
            value={modelLevelFilter}
            onChange={setModelLevelFilter}
            placeholder="Filtrar por nível"
            clearable
            mb="md"
          />
          <div style={{ maxHeight: 250, overflowY: "auto", marginBottom: 16 }}>
            {filteredModelsForModal.length === 0 && (
              <Text size="sm" c="dimmed">
                Nenhum modelo encontrado.
              </Text>
            )}
            {filteredModelsForModal.map((model, idx) => (
              <Card
                key={model.name + idx}
                shadow="sm"
                padding="md"
                mb="sm"
                style={{
                  cursor: "pointer",
                  border:
                    selectedModel?.name === model.name
                      ? "2px solid #1971c2"
                      : "1px solid #eee",
                }}
                onClick={() => setSelectedModel(model)}
              >
                <Group align="center" justify="space-between">
                  <div>
                    <Text fw={500}>{model.name}</Text>
                    <Text size="xs" c="dimmed">
                      {model.description}
                    </Text>
                  </div>
                  {selectedModel?.name === model.name && (
                    <IconStar size={18} color="#1971c2" />
                  )}
                </Group>
              </Card>
            ))}
          </div>
          <Button
            variant="filled"
            color="green"
            fullWidth
            mt="md"
            disabled={!selectedModel}
            onClick={() => {
              if (!modelTargetDay || !selectedModel) return;
              setTrainingDays((prev) =>
                prev.map((day) =>
                  day.date.getTime() === modelTargetDay.getTime()
                    ? { ...day, exercises: selectedModel.exercises }
                    : day
                )
              );
              setAddModelModalOpened(false);
              setSelectedModel(null);
              setModelSearchTerm("");
              setModelLevelFilter([]);
              setModelTargetDay(null);
            }}
          >
            Adicionar ao Dia Atual
          </Button>
        </Modal>
      </Stack>
    </DatesProvider>
  );
}

export default withAuth(NewPlanPage, true);
