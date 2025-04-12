"use client";

import React, { useState, useEffect } from "react";
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
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { SelectClearable } from "@/components/shared";
import Link from "next/link";
import {
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { showNotification } from "@mantine/notifications";

const ClientsPage = () => {
  const r = useRouter();
  const searchParams = useSearchParams();

  const [showClientType, setShowClientType] = useState<string | null>("");
  const [showSeriesStatus, setShowSeriesStatus] = useState<string | null>("");
  const [showClientStatus, setShowClientStatus] = useState<string | null>(""); // Filtro de clientes ativos/inativos
  const [showFollowUpStatus, setShowFollowUpStatus] = useState<string | null>(
    ""
  ); // Filtro de pagamento
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>("");

  useEffect(() => {
    if (!searchParams) return;

    const seriesStatusQuery = searchParams.get("seriesStatus");
    const paymentStatusQuery = searchParams.get("paymentStatus");

    if (
      seriesStatusQuery &&
      ["on_track", "near_due", "overdue"].includes(seriesStatusQuery)
    ) {
      setShowSeriesStatus(seriesStatusQuery);
    }

    if (
      paymentStatusQuery &&
      ["late", "on_time"].includes(paymentStatusQuery)
    ) {
      setShowFollowUpStatus(paymentStatusQuery);
    }
  }, [searchParams]);

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

  const clients = [
    {
      name: "Alice Johnson",
      age: 28,
      gender: "Female",
      email: "alice@example.com",
      phone: "555-123-4567",
      tags: ["Weight Loss", "Muscle Tone"],
      status: "on_track",
      type: "online",
      profilePicture: "",
    },
    {
      name: "Bob Smith",
      age: 35,
      gender: "Male",
      email: "bob@example.com",
      phone: "555-987-6543",
      tags: ["Muscle Building", "Strength"],
      status: "near_due",
      type: "in_person",
      profilePicture: "",
      startDate: "2023-01-15", // Example start date
    },
    {
      name: "Carol Wilson",
      age: 42,
      gender: "Female",
      email: "carol@example.com",
      phone: "555-456-7890",
      tags: ["Flexibility", "Core Strength"],
      status: "overdue",
      type: "hybrid",
      profilePicture: "",
    },
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

  return (
    <>
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>Clientes</Title>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Client</Button>
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
            placeholder="Search clients by name or email..."
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
      <Grid>
        {clients
          .filter((client) => {
            if (showClientType && client.type !== showClientType) return false;
            if (showSeriesStatus && client.status !== showSeriesStatus)
              return false;
            if (showClientStatus && client.status !== showClientStatus)
              return false;
            if (showFollowUpStatus && client.status !== showFollowUpStatus)
              return false;
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
            <Grid.Col key={index} span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Link href="/dashboard/clients/clientId">
                  <Flex align="center" gap="sm">
                    <Avatar
                      src={client.profilePicture || ""}
                      radius="xl"
                      size="md"
                    />
                    <Title order={4}>{client.name}</Title>
                  </Flex>
                  <p>
                    {client.age} years • {client.gender}
                  </p>
                </Link>
                <Flex gap="xs" wrap="wrap" mb="sm">
                  {client.tags.map((tag, idx) => (
                    <Badge key={idx} c="blue" variant="light">
                      {tag}
                    </Badge>
                  ))}
                </Flex>
                <Badge c="gray" variant="outline" mb="sm">
                  {client.type}
                </Badge>
                <Flex align="center" gap="xs" mb="sm">
                  {client.status === "on_track" && (
                    <>
                      <IconCheck size={16} />
                      <p style={{ color: "green" }}>
                        Série: <strong>Em Dia</strong>
                      </p>
                    </>
                  )}
                  {client.status === "near_due" && (
                    <>
                      <IconAlertTriangle size={16} />
                      <p style={{ color: "orange" }}>
                        Série: <strong>Próximo ao Vencimento</strong>
                      </p>
                    </>
                  )}
                  {client.status === "overdue" && (
                    <>
                      <IconAlertCircle size={16} />
                      <p style={{ color: "red" }}>
                        Série: <strong>Vencida</strong>
                      </p>
                    </>
                  )}
                </Flex>
                <p
                  style={{
                    cursor: "pointer",
                    color: "orange",
                    textDecoration: "underline",
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
                </p>

                <a
                  href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "green",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "5px",
                    fontWeight: "bold",
                  }}
                >
                  <IconBrandWhatsapp size={20} /> {client.phone}
                </a>
                <Flex mt="md" gap="sm">
                  <Button variant="outline" size="xs">
                    Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      r.push(`/dashboard/clients/clientId?tab=training`)
                    }
                  >
                    Workout Plan
                  </Button>
                </Flex>
              </Card>
            </Grid.Col>
          ))}
      </Grid>
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
    </>
  );
};

export default withAuth(ClientsPage, false);
