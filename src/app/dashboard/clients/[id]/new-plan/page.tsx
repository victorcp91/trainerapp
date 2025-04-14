"use client";

import { Fragment } from "react";
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

  const handleModalSave = (tempExercises: any) => {
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

  const handlePublish = () => {
    console.log("Treino publicado");
    setPublishModalOpened(false);
  };

  const availableDays = ["segunda-feira", "quarta-feira", "sexta-feira"]; // Dias disponíveis

  function toggleReplicationDate(day: Date): void {
    throw new Error("Function not implemented.");
  }

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
                    <Divider mt="sm" />
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
                            {/* {matchedExercise && (
                              <Text size="xs" c="dimmed">
                                {matchedExercise.group} -{" "}
                                {matchedExercise.subGroup}
                              </Text>
                            )} */}
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
