"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Group,
  Text,
  Title,
  Modal,
  TextInput,
  Select,
  Avatar,
  Tooltip,
  Indicator,
  MultiSelect,
  Flex,
} from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { DatePicker } from "@mantine/dates";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconCalendar,
  IconMapPin,
  IconEdit,
} from "@tabler/icons-react";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [appointmentLocation, setAppointmentLocation] = useState<{
    name: string;
    formatted_address: string;
    place_id: string;
  } | null>(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);
  const [canceledAppointments, setCanceledAppointments] = useState(0);
  const [missedAppointments, setMissedAppointments] = useState(0);
  const [appointments, setAppointments] = useState<
    {
      id: number;
      client: string;
      address: string;
      startTime: string; // Alterado para incluir horário inicial
      endTime: string; // Adicionado para incluir horário final
      avatar: string;
    }[]
  >([
    {
      id: 1,
      client: "João Silva",
      address: "Rua das Flores, 123 - São Paulo, SP",
      startTime: new Date().toISOString(), // Horário inicial
      endTime: new Date(new Date().getTime() + 3600000).toISOString(), // Horário final (1h depois)
      avatar: "",
    },
    {
      id: 2,
      client: "Maria Oliveira",
      address: "Avenida Paulista, 456 - São Paulo, SP",
      startTime: new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString(),
      endTime: new Date(
        new Date().setDate(new Date().getDate() + 1) + 3600000
      ).toISOString(),
      avatar: "",
    },
  ]);

  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [currentAction, setCurrentAction] = useState<{
    type: "cancel" | "absence";
    appointmentId: number | null;
  }>({ type: "cancel", appointmentId: null });

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.google || !inputRef.current)
      return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment"],
        componentRestrictions: { country: "br" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      console.log("here");
      const place = autocomplete.getPlace();
      if (place) {
        setAppointmentLocation({
          name: place.name || "",
          formatted_address: place.formatted_address || "",
          place_id: place.place_id || "",
        });
      }
    });
  }, []);

  const calculateDonutData = () => {
    const total = totalAppointments || 1; // Evitar divisão por zero
    const pending =
      total -
      (completedAppointments + canceledAppointments + missedAppointments);
    return [
      {
        value: completedAppointments,
        color: "green",
        name: "Concluídos",
      },
      {
        name: "Cancelados",
        value: canceledAppointments,
        color: "yellow",
      },
      {
        name: "Faltas",
        value: missedAppointments,
        color: "red",
      },
      {
        name: "Pendentes",
        value: pending,
        color: "gray",
      },
    ];
  };

  // Exemplo de valores fictícios para os gráficos
  useEffect(() => {
    setTotalAppointments(120); // Total de agendamentos
    setCompletedAppointments(60); // Total de concluídos
    setCanceledAppointments(25); // Total de cancelados
    setMissedAppointments(15); // Total de faltas
    // Pendentes serão calculados automaticamente como 20
  }, []);

  const handleScheduleAppointment = () => {
    setIsModalOpen(false);
    setAppointmentDetails("");
    setSelectedClient(null);
    setAppointmentTime(null);
    setAppointmentLocation(null);
  };

  const handleCheckIn = (id: number) => {
    console.log(`Check-in realizado para o agendamento ${id}`);
  };

  const handleOpenReasonModal = (type: "cancel" | "absence", id: number) => {
    setCurrentAction({ type, appointmentId: id });
    setReason("");
    setIsReasonModalOpen(true);
  };

  const handleConfirmReason = () => {
    if (
      currentAction.type === "cancel" &&
      currentAction.appointmentId !== null
    ) {
      console.log(
        `Agendamento ${currentAction.appointmentId} cancelado. Motivo: ${reason}`
      );
      setAppointments((prev) =>
        prev.filter(
          (appointment) => appointment.id !== currentAction.appointmentId
        )
      );
    } else if (
      currentAction.type === "absence" &&
      currentAction.appointmentId !== null
    ) {
      console.log(
        `Falta registrada para o agendamento ${currentAction.appointmentId}. Motivo: ${reason}`
      );
    }
    setIsReasonModalOpen(false);
  };

  const handleEditAppointment = (appointment: {
    id: number;
    client: string;
    address: string;
    startTime: string;
    endTime: string;
    avatar: string;
  }) => {
    setSelectedClient(appointment.client);
    setSelectedDate(new Date(appointment.startTime));
    setAppointmentTime(
      new Date(appointment.startTime).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setAppointmentDetails(appointment.address);
    setIsModalOpen(true);
  };

  const renderDay = (date: Date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const hasAppointments = appointments.some(
      (appointment) =>
        new Date(appointment.startTime).toDateString() === date.toDateString()
    );

    return (
      <div
        style={{
          backgroundColor:
            isToday &&
            selectedDate &&
            date.toDateString() !== selectedDate.toDateString()
              ? "#e0f7fa"
              : "transparent", // Fundo azul claro apenas para hoje se outra data estiver selecionada
          borderRadius: "50%",
          padding: "5px",
        }}
      >
        <Indicator
          size={8}
          color="blue"
          offset={-2}
          disabled={!hasAppointments}
        >
          <div>{date.getDate()}</div>
        </Indicator>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Group mb="lg">
        <Title order={1}>Atendimentos</Title>
      </Group>

      <Group mb="lg" grow style={{ alignItems: "stretch" }}>
        {/* Card do ano */}
        <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
          <Group style={{ flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Title order={3}>
                {selectedDate
                  ? selectedDate.getFullYear().toString()
                  : "Ano não selecionado"}
              </Title>
            </div>
            <DonutChart
              style={{ marginTop: "-50px" }}
              data={calculateDonutData()}
              withLabels
              withLabelsLine
              labelsType="value"
              paddingAngle={5}
              size={100}
              thickness={14}
            />
          </Group>
        </Card>

        {/* Card do mês */}
        <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
          <Group style={{ flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Title order={3}>
                {selectedDate
                  ? selectedDate.toLocaleDateString("pt-BR", {
                      month: "long",
                      year:
                        selectedDate.getFullYear() !== new Date().getFullYear()
                          ? "numeric"
                          : undefined,
                    })
                  : "Mês não selecionado"}
              </Title>
            </div>
            <DonutChart
              style={{ marginTop: "-50px" }}
              paddingAngle={5}
              size={100}
              thickness={14}
              data={calculateDonutData()}
              withLabels
              withLabelsLine
              labelsType="value"
            />
          </Group>
        </Card>

        {/* Card do dia */}
        <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
          <Group style={{ flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Title order={3}>Hoje</Title>
            </div>
            <DonutChart
              style={{ marginTop: "-50px" }}
              paddingAngle={5}
              size={100}
              thickness={14}
              data={calculateDonutData()}
              withLabels
              withLabelsLine
              labelsType="value"
            />
          </Group>
        </Card>
      </Group>

      <Group align="flex-start">
        {/* Sidebar com o calendário */}
        <Card withBorder shadow="sm" px="lg" py="xs" style={{ width: "300px" }}>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            renderDay={renderDay}
          />
        </Card>

        {/* Detalhes do dia selecionado */}
        <Card
          withBorder
          shadow="sm"
          px="lg"
          py="xs"
          style={{ width: "250px", flex: 1 }}
        >
          <Group mb="md" style={{ justifyContent: "space-between" }}>
            <Title order={2}>
              {selectedDate
                ? selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Nenhuma data selecionada"}
            </Title>
            <Group style={{ alignItems: "center", gap: "10px" }}>
              <Tooltip label="Total de agendamentos" withArrow>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <IconCalendar size={20} color="blue" />
                  <Text size="sm">{totalAppointments}</Text>
                </div>
              </Tooltip>
              <Tooltip label="Total de concluídos" withArrow>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <IconCheck size={20} color="green" />
                  <Text size="sm">{completedAppointments}</Text>
                </div>
              </Tooltip>
              <Tooltip label="Total de cancelados" withArrow>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <IconX size={20} color="red" />
                  <Text size="sm">{canceledAppointments}</Text>
                </div>
              </Tooltip>
              <Tooltip label="Total de faltas" withArrow>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <IconAlertCircle size={20} color="yellow" />
                  <Text size="sm">{missedAppointments}</Text>
                </div>
              </Tooltip>
            </Group>
          </Group>
          <Card style={{ textAlign: "center" }}>
            {appointments
              .filter(
                (appointment) =>
                  selectedDate &&
                  new Date(appointment.startTime).toDateString() ===
                    selectedDate.toDateString()
              )
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              .map((appointment) => (
                <Card
                  key={appointment.id}
                  withBorder
                  shadow="sm"
                  padding="md"
                  mb="sm"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <Group
                    style={{
                      flexDirection: "row",
                      gap: "5px",
                      alignItems: "flex-start",
                      flex: 1,
                      marginTop: "-10px",
                    }}
                  >
                    <Group
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "5px",
                        marginTop: "5px",
                        flex: 1,
                      }}
                    >
                      <Group>
                        <Text
                          size="sm"
                          color="dimmed"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {new Date(appointment.startTime).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                          {" - "}
                          {new Date(appointment.endTime).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                      </Group>
                      <Group style={{ flex: 1 }}>
                        <Avatar
                          src={appointment.avatar}
                          alt={`Avatar de ${appointment.client}`}
                          radius="xl"
                          size={40}
                        />
                        <Text>{appointment.client}</Text>
                        <Text
                          size="sm"
                          color="dimmed"
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <IconMapPin size={16} color="blue" />
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              appointment.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            {appointment.address}
                          </a>
                        </Text>
                      </Group>
                      <Group mt="xs">
                        <Button
                          size="xs"
                          variant="light"
                          color="green"
                          onClick={() => handleCheckIn(appointment.id)}
                        >
                          Check-in
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color="yellow"
                          onClick={() =>
                            handleOpenReasonModal("absence", appointment.id)
                          }
                        >
                          Falta
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() =>
                            handleOpenReasonModal("cancel", appointment.id)
                          }
                        >
                          Cancelar
                        </Button>
                      </Group>
                    </Group>
                  </Group>
                  <Tooltip label="Editar atendimento" withArrow>
                    <IconEdit
                      size={20}
                      color="blue"
                      style={{
                        cursor: "pointer",
                        alignSelf: "flex-start",
                      }}
                      onClick={() => handleEditAppointment(appointment)}
                    />
                  </Tooltip>
                </Card>
              ))}
            <Button
              variant="outline"
              c="blue"
              onClick={() => setIsModalOpen(true)}
              mt="md"
            >
              + Agendar atendimento
            </Button>
          </Card>
        </Card>
      </Group>

      {/* Modal para agendar atendimento */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        title={null}
      >
        <Flex align="center" gap="md" mb="md">
          <Title order={4} style={{ margin: 0, whiteSpace: "nowrap" }}>
            Agendar atendimento
          </Title>
          <Select
            placeholder="Selecione o cliente"
            data={[
              { value: "1", label: "João Silva" },
              { value: "2", label: "Maria Oliveira" },
              { value: "3", label: "Alice Johnson" },
            ]}
            value={selectedClient}
            onChange={setSelectedClient}
            style={{ minWidth: 220 }}
            searchable
            required
            nothingFoundMessage="Nenhum cliente encontrado"
            size="sm"
          />
        </Flex>
        <Flex gap="lg" direction="row" align="flex-start">
          <Group flex={1} justify="center">
            <Text>Selecione o cliente e o dia do atendimento</Text>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              renderDay={renderDay}
            />
          </Group>
          <Group flex={1}>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: 10,
                padding: 20,
                minHeight: 120,
                boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
                border: "1px solid #f1f3f5",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "340px",
              }}
            >
              <Text
                fw={600}
                mb={8}
                size="sm"
                style={{ flex: "none", letterSpacing: 0.2 }}
              >
                Intervalos ocupados:
              </Text>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {/* Aqui você pode exibir intervalos ocupados se desejar, usando lógica semelhante à página de clientes */}
                <Text size="sm" c="dimmed" style={{ fontSize: 14, padding: 8 }}>
                  Nenhum (mock)
                </Text>
              </div>
            </div>
          </Group>
        </Flex>
        {selectedDate && (
          <>
            <Group mt="md">
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Horário de início
                </label>
                <input
                  type="time"
                  value={appointmentTime || ""}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  disabled={!selectedDate}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ced4da",
                    fontSize: 15,
                  }}
                  placeholder="HH:mm"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Horário final
                </label>
                <input
                  type="time"
                  value={appointmentTime || ""}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  disabled={!selectedDate}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ced4da",
                    fontSize: 15,
                  }}
                  placeholder="HH:mm"
                />
              </div>
            </Group>
            <Group my="md">
              <MultiSelect
                label="Recorrência (dias da semana)"
                placeholder="Selecione os dias"
                data={[
                  { value: "0", label: "Domingo" },
                  { value: "1", label: "Segunda" },
                  { value: "2", label: "Terça" },
                  { value: "3", label: "Quarta" },
                  { value: "4", label: "Quinta" },
                  { value: "5", label: "Sexta" },
                  { value: "6", label: "Sábado" },
                ]}
                value={[]}
                onChange={() => {}}
                clearable
              />
            </Group>
            <Group>
              <div style={{ width: "100%" }}>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Localização
                </label>
                <input
                  ref={inputRef}
                  placeholder="Digite o local (ex: Smart Fit, Estúdio Y...)"
                  value={appointmentLocation?.formatted_address || ""}
                  onChange={() => {}}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ced4da",
                    fontSize: 15,
                  }}
                />
              </div>
            </Group>
            <Group mt="md">
              <div style={{ width: "100%" }}>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Observação
                </label>
                <textarea
                  value={appointmentDetails}
                  onChange={(e) => setAppointmentDetails(e.target.value)}
                  placeholder="Digite observações relevantes para o atendimento (opcional)"
                  style={{
                    width: "100%",
                    minHeight: 60,
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid #ced4da",
                    fontSize: 15,
                  }}
                />
              </div>
            </Group>
            <Button
              mt="md"
              onClick={handleScheduleAppointment}
              disabled={!selectedClient || !appointmentTime}
            >
              Agendar Atendimento
            </Button>
          </>
        )}
      </Modal>

      {/* Modal para registrar motivo */}
      <Modal
        opened={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        title={
          currentAction.type === "cancel"
            ? "Motivo do Cancelamento"
            : "Motivo da Falta"
        }
      >
        <TextInput
          label="Motivo"
          placeholder="Descreva o motivo (opcional)"
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
        />
        <Button mt="md" fullWidth onClick={handleConfirmReason}>
          Confirmar
        </Button>
      </Modal>
    </div>
  );
};

export default CalendarPage;
