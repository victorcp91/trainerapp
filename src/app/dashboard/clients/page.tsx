"use client";

import React, { useState, useEffect, useRef } from "react";
import { withAuth } from "@/utils/withAuth";
import {
  Button,
  Flex,
  Title,
  TextInput,
  Card,
  Grid,
  Badge,
  Avatar,
  Modal,
  Group,
  Textarea,
  Select,
  Loader,
  Text,
  MultiSelect,
} from "@mantine/core";
import { DateInput, Calendar, DatesProvider } from "@mantine/dates";
import "dayjs/locale/pt-br";
import { SelectClearable } from "@/components/shared";
import {
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

type Client = {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  type: string;
  profilePicture: string;
  startDate?: string;
};

const clients = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 28,
    gender: "Feminino",
    email: "alice@example.com",
    phone: "555-123-4567",
    tags: ["Emagrecimento", "Definição Muscular"],
    status: "on_track",
    type: "online",
    profilePicture: "",
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 35,
    gender: "Masculino",
    email: "bob@example.com",
    phone: "555-987-6543",
    tags: ["Hipertrofia", "Força"],
    status: "near_due",
    type: "in_person",
    profilePicture: "",
    startDate: "2023-01-15",
  },
  {
    id: "3",
    name: "Carol Wilson",
    age: 42,
    gender: "Feminino",
    email: "carol@example.com",
    phone: "555-456-7890",
    tags: ["Flexibilidade", "Core"],
    status: "overdue",
    type: "hybrid",
    profilePicture: "",
  },
];

// Função utilitária para converter string "HH:mm" em minutos
function timeStringToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Função para verificar se dois intervalos se sobrepõem
function intervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
) {
  const aStart = timeStringToMinutes(startA);
  const aEnd = timeStringToMinutes(endA);
  const bStart = timeStringToMinutes(startB);
  const bEnd = timeStringToMinutes(endB);
  return aStart < bEnd && bStart < aEnd;
}

const ClientsPage = () => {
  const r = useRouter();

  const [showClientType, setShowClientType] = useState<string | null>("");
  const [showSeriesStatus, setShowSeriesStatus] = useState<string | null>("");
  const [showClientStatus, setShowClientStatus] = useState<string | null>(""); // Filtro de clientes ativos/inativos
  const [showFollowUpStatus, setShowFollowUpStatus] = useState<string | null>(
    ""
  ); // Filtro de pagamento
  const [showGender, setShowGender] = useState<string | null>(""); // Filtro de gênero
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>("");
  const [loadedClients, setLoadedClients] = useState(clients.slice(0, 6)); // Estado para clientes carregados
  const [isLoading, setIsLoading] = useState(false); // Estado para o indicador de carregamento

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]); // Simulação
  const [occupiedIntervals, setOccupiedIntervals] = useState<
    { start: string; end: string; clientName: string; location?: string }[]
  >([]); // Simulação
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<null | {
    idx: number;
    interval: {
      start: string;
      end: string;
      clientName: string;
      location?: string;
    };
  }>(null);
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]); // Dias da semana para recorrência
  const [location, setLocation] = useState<string>(""); // Localização do atendimento
  const [observation, setObservation] = useState<string>(""); // Observação do atendimento

  const locationInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.google ||
      !locationInputRef.current
    )
      return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
      {
        types: ["establishment"],
        componentRestrictions: { country: "br" },
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place) {
        setLocation(place.formatted_address || place.name || "");
      }
    });
  }, [locationInputRef.current]);

  const attendances = [
    {
      clientId: "2",
      date: "2025-04-15",
      times: ["09:00", "10:00"],
      location: "Academia X",
    },
    {
      clientId: "2",
      date: "2025-04-16",
      times: ["14:00", "15:00"],
      location: "Estúdio Y",
    },
  ];

  const weekDays = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Segunda" },
    { value: "2", label: "Terça" },
    { value: "3", label: "Quarta" },
    { value: "4", label: "Quinta" },
    { value: "5", label: "Sexta" },
    { value: "6", label: "Sábado" },
  ];

  useEffect(() => {
    // Gera o array de datas ocupadas baseado em todos os attendances
    // Corrige para garantir que o fuso horário não afete a comparação no calendário
    const dates = attendances.map((a) => {
      const [year, month, day] = a.date.split("-").map(Number);
      // Cria a data no fuso local, sem horário UTC
      return new Date(year, month - 1, day);
    });
    setOccupiedDates(dates);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setOccupiedIntervals([]);
      return;
    }
    const dateStr = selectedDate.toISOString().slice(0, 10);
    // Busca todos os intervalos ocupados por qualquer cliente na data
    const intervals = attendances
      .filter((a) => a.date === dateStr)
      .map((a) => ({
        start: a.times[0],
        end: a.times[1],
        clientName: clients.find((c) => c.id === a.clientId)?.name || "Aluno",
        location: a.location || undefined,
      }));
    setOccupiedIntervals(intervals);
  }, [selectedDate]);

  const handleOpenScheduleModal = (client: Client) => {
    setSelectedClient(client);
    setIsScheduleModalOpen(true);
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setRecurrenceDays([]);
    setLocation("");
    setObservation("");
  };

  const handleSchedule = () => {
    if (!selectedDate || !startTime || !endTime || !location || !selectedClient)
      return;
    // Função auxiliar para adicionar dias
    function addDays(date: Date, days: number) {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    }
    // Se recorrência, agenda para todos os dias selecionados
    let scheduled = false;
    if (recurrenceDays.length > 0) {
      // Agenda para as próximas 4 semanas nos dias selecionados
      for (let week = 0; week < 4; week++) {
        recurrenceDays.forEach((day) => {
          const base = new Date(selectedDate);
          const baseDay = base.getDay();
          const targetDay = parseInt(day);
          const diff = ((targetDay - baseDay + 7) % 7) + week * 7;
          const dateToSchedule = addDays(base, diff);
          const dateStr = dateToSchedule.toISOString().slice(0, 10);
          // Verifica sobreposição
          const overlap = attendances.some(
            (a) =>
              a.date === dateStr &&
              intervalsOverlap(startTime, endTime, a.times[0], a.times[1])
          );
          if (!overlap) {
            attendances.push({
              clientId: selectedClient.id,
              date: dateStr,
              times: [startTime, endTime],
              location,
            });
            scheduled = true;
          }
        });
      }
      if (scheduled) {
        showNotification({
          title: "Agendamento recorrente realizado",
          message: `Atendimentos agendados para os dias selecionados nas próximas 4 semanas.`,
          color: "green",
        });
      } else {
        showNotification({
          title: "Conflito de horário",
          message:
            "Já existe um atendimento em algum dos horários selecionados.",
          color: "red",
        });
      }
      setIsScheduleModalOpen(false);
      return;
    }
    // Agendamento único
    const overlap = occupiedIntervals.some((interval) =>
      intervalsOverlap(startTime, endTime, interval.start, interval.end)
    );
    if (overlap) {
      showNotification({
        title: "Conflito de horário",
        message: "Já existe um atendimento neste intervalo.",
        color: "red",
      });
      return;
    }
    attendances.push({
      clientId: selectedClient.id,
      date: selectedDate.toISOString().slice(0, 10),
      times: [startTime, endTime],
      location,
    });
    showNotification({
      title: "Agendamento realizado",
      message: `Atendimento agendado para ${
        selectedClient.name
      } em ${selectedDate.toLocaleDateString()} das ${startTime} às ${endTime} (${location})`,
      color: "green",
    });
    setIsScheduleModalOpen(false);
  };

  const handleCancelAttendance = (idx: number) => {
    // Remove do array attendances (mock)
    const dateStr = selectedDate?.toISOString().slice(0, 10);
    if (!dateStr) return;
    const interval = occupiedIntervals[idx];
    // Remove do array attendances
    const i = attendances.findIndex(
      (a) =>
        a.date === dateStr &&
        a.times[0] === interval.start &&
        a.times[1] === interval.end
    );
    if (i !== -1) {
      attendances.splice(i, 1);
      // Atualiza os intervalos ocupados
      setOccupiedIntervals((prev) => prev.filter((_, j) => j !== idx));
      showNotification({
        title: "Atendimento desmarcado",
        message: `O atendimento de ${interval.clientName} foi desmarcado.`,
        color: "green",
      });
    }
    setConfirmCancel(null);
  };

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = () => {
    if (isLoading || loadedClients.length >= clients.length) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextClients = clients.slice(
        loadedClients.length,
        loadedClients.length + 6
      );

      if (nextClients.length > 0) {
        setLoadedClients((prev) => [...prev, ...nextClients]);
      }

      setIsLoading(false);
    }, 500);
  };

  const clientTypes = [
    { value: "online", label: "Online" },
    { value: "in_person", label: "Presencial" },
    { value: "hybrid", label: "Híbrido" },
  ];

  const seriesStatuses = [
    { value: "on_track", label: "Em Dia" },
    { value: "near_due", label: "Próximo ao Vencimento" },
    { value: "overdue", label: "Vencida" },
  ];

  const clientStatuses = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
  ];

  const paymentStatuses = [
    { value: "late", label: "Atrasado" },
    { value: "on_time", label: "Em Dia" },
  ];

  const sortOptions = [
    { value: "name-asc", label: "Nome (A-Z)" },
    { value: "name-desc", label: "Nome (Z-A)" },
    { value: "age-asc", label: "Idade (Crescente)" },
    { value: "age-desc", label: "Idade (Decrescente)" },
    { value: "priority", label: "Prioridade de Séries" },
    { value: "createdAt", label: "Tempo de Acompanhamento" },
  ];

  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      birthDate: null,
      gender: "",
      cpf: "",
      notes: "",
      clientType: "",
    },
    validate: {
      fullName: (value) => (value ? null : "Nome é obrigatório"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "E-mail inválido ou vazio",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Client data:", values);
    setIsModalOpen(false);
    form.reset();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, isLoading]);

  return (
    <DatesProvider settings={{ locale: "pt-br" }}>
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>Clientes</Title>
        <Button onClick={() => setIsModalOpen(true)}>
          + Adicionar Cliente
        </Button>
      </Flex>
      <Flex mb="lg" gap="md">
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Tipo de Cliente
          </label>
          <SelectClearable
            options={clientTypes}
            value={showClientType}
            setValue={setShowClientType}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Status da Série
          </label>
          <SelectClearable
            options={seriesStatuses}
            value={showSeriesStatus}
            setValue={setShowSeriesStatus}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Status do Cliente
          </label>
          <SelectClearable
            options={clientStatuses}
            value={showClientStatus}
            setValue={setShowClientStatus}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Gênero
          </label>
          <SelectClearable
            options={[
              { value: "Feminino", label: "Feminino" },
              { value: "Masculino", label: "Masculino" },
              { value: "Outro", label: "Outro" },
            ]}
            value={showGender}
            setValue={setShowGender}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Pagamento
          </label>
          <SelectClearable
            options={paymentStatuses}
            value={showFollowUpStatus}
            setValue={setShowFollowUpStatus}
          />
        </div>
      </Flex>
      <Flex gap="md">
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Buscar Clientes
          </label>
          <TextInput
            placeholder="Buscar clientes por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
        <div style={{ flex: 1, marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Ordenar por
          </label>
          <Select
            placeholder="Selecione uma opção"
            data={sortOptions}
            value={sortOption}
            onChange={setSortOption}
          />
        </div>
      </Flex>
      <Grid gutter="lg">
        {loadedClients
          .filter((client) => {
            if (showClientType && client.type !== showClientType) return false;
            if (showSeriesStatus && client.status !== showSeriesStatus)
              return false;
            if (showClientStatus && client.status !== showClientStatus)
              return false;
            if (showFollowUpStatus && client.status !== showFollowUpStatus)
              return false;
            if (showGender && client.gender !== showGender) return false;
            return true;
          })
          .sort((a, b) => {
            if (!sortOption) return 0;
            switch (sortOption) {
              case "name-asc":
                return a.name.localeCompare(b.name);
              case "name-desc":
                return b.name.localeCompare(a.name);
              case "age-asc":
                return a.age - b.age;
              case "age-desc":
                return b.age - a.age;
              case "priority":
                const priorityOrder = ["overdue", "near_due", "on_track"];
                return (
                  priorityOrder.indexOf(a.status) -
                  priorityOrder.indexOf(b.status)
                );
              case "createdAt":
                return (
                  new Date(a.startDate || 0).getTime() -
                  new Date(b.startDate || 0).getTime()
                );
              default:
                return 0;
            }
          })
          .map((client, index) => (
            <Grid.Col
              key={index}
              span={{ xs: 6, lg: 3 }}
              style={{ display: "flex" }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "space-between",
                  minHeight: 340,
                  background: "#fff",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)",
                }}
              >
                <Flex
                  align="center"
                  gap="sm"
                  mb="xs"
                  style={{ cursor: "pointer" }}
                  onClick={() => r.push(`/dashboard/clients/${client.id}`)}
                >
                  <Avatar
                    src={client.profilePicture || ""}
                    radius="xl"
                    size="md"
                  />
                  <div style={{ flex: 1 }}>
                    <Title order={4} size="h6" style={{ marginBottom: 0 }}>
                      {client.name}
                    </Title>
                    <Text size="sm" c="dimmed">
                      {client.age} anos • {client.gender}
                    </Text>
                  </div>
                </Flex>
                <Flex
                  gap="xs"
                  wrap="wrap"
                  mb="xs"
                  style={{ minHeight: 40, alignItems: "center" }}
                >
                  {client.tags.map((tag, idx) => (
                    <Badge key={idx} c="blue" variant="light" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </Flex>
                <Badge c="gray" variant="outline" mb="xs" size="sm">
                  {client.type === "online"
                    ? "Online"
                    : client.type === "in_person"
                    ? "Presencial"
                    : "Híbrido"}
                </Badge>
                <Flex align="center" gap="xs" mb="xs">
                  {client.status === "on_track" && (
                    <>
                      <IconCheck size={16} />
                      <Text size="sm" c="green">
                        Série: <strong>Em Dia</strong>
                      </Text>
                    </>
                  )}
                  {client.status === "near_due" && (
                    <>
                      <IconAlertTriangle size={16} />
                      <Text size="sm" c="orange">
                        Série: <strong>Próx. do Vencimento</strong>
                      </Text>
                    </>
                  )}
                  {client.status === "overdue" && (
                    <>
                      <IconAlertCircle size={16} />
                      <Text size="sm" c="red">
                        Série: <strong>Vencida</strong>
                      </Text>
                    </>
                  )}
                </Flex>
                <Text
                  size="sm"
                  style={{
                    cursor: "pointer",
                    color: "orange",
                    textDecoration: "underline",
                    marginBottom: 4,
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(client.email);
                    showNotification({
                      title: "E-mail copiado!",
                      message:
                        "O e-mail foi copiado para a área de transferência.",
                      color: "orange",
                      position: "top-right",
                    });
                  }}
                >
                  {client.email}
                </Text>
                <a
                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "green",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 8,
                  }}
                >
                  <IconBrandWhatsapp size={18} /> {client.phone}
                </a>
                <Flex mt="auto" gap="sm">
                  <Button
                    variant="outline"
                    size="xs"
                    fullWidth
                    onClick={() => handleOpenScheduleModal(client)}
                  >
                    Agendar
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    fullWidth
                    onClick={() =>
                      r.push(`/dashboard/clients/clientId?tab=training`)
                    }
                  >
                    Treino
                  </Button>
                </Flex>
              </Card>
            </Grid.Col>
          ))}
      </Grid>
      {isLoading && <Loader size="lg" mt="lg" />}
      <div ref={loadMoreRef} style={{ height: "1px" }} />
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Cliente"
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex gap="lg" align="flex-start">
            <div style={{ flex: 1 }}>
              <Title order={4} mb="sm">
                Dados Pessoais
              </Title>
              <TextInput
                label="Nome completo"
                placeholder="Digite o nome completo"
                {...form.getInputProps("fullName")}
                required
              />
              <TextInput
                label="E-mail"
                placeholder="Digite o e-mail"
                {...form.getInputProps("email")}
                required
              />
              <TextInput
                label="Telefone"
                placeholder="Digite o telefone"
                {...form.getInputProps("phone")}
              />
              <DateInput
                label="Data de nascimento"
                placeholder="Selecione a data"
                {...form.getInputProps("birthDate")}
              />
              <Select
                label="Gênero"
                placeholder="Selecione"
                data={[
                  "Masculino",
                  "Feminino",
                  "Outro",
                  "Prefere não informar",
                ]}
                {...form.getInputProps("gender")}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title order={4} mb="sm">
                Informações Adicionais
              </Title>
              <Textarea
                label="Observações"
                placeholder="Ex: alérgico a látex"
                {...form.getInputProps("notes")}
              />
              <Select
                label="Modalidade de atendimento"
                placeholder="Selecione"
                data={["Presencial", "Remoto", "Híbrido"]}
                {...form.getInputProps("clientType")}
                required
              />
            </div>
          </Flex>
          <Group mt="md">
            <Button type="submit">Cadastrar</Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        size="xl"
        title={null}
      >
        <Flex align="center" gap="md" mb="md">
          <Title order={4} style={{ margin: 0, whiteSpace: "nowrap" }}>
            Agendar atendimento
          </Title>
          <Select
            placeholder="Selecione o cliente"
            data={clients.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedClient?.id || ""}
            onChange={(id) => {
              const client = clients.find((c) => c.id === id) || null;
              setSelectedClient(client);
            }}
            style={{ minWidth: 220 }}
            searchable
            required
            nothingFoundMessage="Nenhum cliente encontrado"
            size="sm"
          />
        </Flex>
        <Flex gap="lg" direction="row" align="flex-start">
          <Group flex={1} justify="center">
            <Text>Selecione o dia do atendimento</Text>
            <Calendar
              locale="pt-br"
              __onDayClick={(event, day) => setSelectedDate(day)}
              minDate={new Date()}
              renderDay={(date) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isOccupied = occupiedDates.some(
                  (d) => d.toDateString() === date.toDateString()
                );
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();
                return (
                  <div
                    style={{
                      background: isSelected
                        ? "#228be6"
                        : isOccupied
                        ? "#ffe0e0"
                        : undefined,
                      border: isToday ? "2px solid #228be6" : undefined,
                      borderRadius: 6,
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: isToday ? "bold" : "normal",
                      color: isSelected
                        ? "white"
                        : isOccupied
                        ? "#c92a2a"
                        : undefined,
                    }}
                  >
                    {date.getDate()}
                  </div>
                );
              }}
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
                {selectedDate ? (
                  occupiedIntervals.length === 0 ? (
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{ fontSize: 14, padding: 8 }}
                    >
                      Nenhum
                    </Text>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {occupiedIntervals.map((i, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: 14,
                            marginBottom: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>
                            {i.start} - {i.end}: <b>{i.clientName}</b>
                            {i.location ? ` (${i.location})` : ""}
                          </span>
                          <Button
                            size="xs"
                            color="red"
                            variant="subtle"
                            style={{
                              minWidth: 80,
                              fontSize: 13,
                              padding: "2px 8px",
                            }}
                            onClick={() =>
                              setConfirmCancel({ idx, interval: i })
                            }
                          >
                            Desmarcar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <Text
                    size="sm"
                    c="dimmed"
                    style={{ fontSize: 14, padding: 8 }}
                  >
                    Selecione um dia
                  </Text>
                )}
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
                  value={startTime || ""}
                  onChange={(e) => setStartTime(e.target.value)}
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
                  value={endTime || ""}
                  onChange={(e) => setEndTime(e.target.value)}
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
                data={weekDays}
                value={recurrenceDays}
                onChange={setRecurrenceDays}
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
                  ref={locationInputRef}
                  placeholder="Digite o local (ex: Smart Fit, Estúdio Y...)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  value={observation || ""}
                  onChange={(e) => setObservation(e.target.value)}
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
              onClick={handleSchedule}
              disabled={!startTime || !endTime || !location}
            >
              Agendar Atendimento
            </Button>
          </>
        )}
      </Modal>
      <Modal
        opened={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        title="Confirmar desmarcação"
        centered
      >
        <Text>
          Tem certeza que deseja desmarcar o atendimento de{" "}
          <b>{confirmCancel?.interval.clientName}</b>
          {confirmCancel?.interval.location
            ? ` (${confirmCancel.interval.location})`
            : ""}{" "}
          das {confirmCancel?.interval.start} às {confirmCancel?.interval.end}?
        </Text>
        <Group mt="md">
          <Button onClick={() => setConfirmCancel(null)} variant="default">
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={() => handleCancelAttendance(confirmCancel!.idx)}
          >
            Desmarcar
          </Button>
        </Group>
      </Modal>
    </DatesProvider>
  );
};

export default withAuth(ClientsPage, true);
