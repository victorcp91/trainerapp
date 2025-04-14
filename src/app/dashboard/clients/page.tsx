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

const clients = [
  {
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
    name: "Bob Smith",
    age: 35,
    gender: "Masculino",
    email: "bob@example.com",
    phone: "555-987-6543",
    tags: ["Hipertrofia", "Força"],
    status: "near_due",
    type: "in_person",
    profilePicture: "",
    startDate: "2023-01-15", // Exemplo de data de início
  },
  {
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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = () => {
    if (isLoading || loadedClients.length >= clients.length) return; // Verifica se todos os clientes já foram carregados

    setIsLoading(true);
    setTimeout(() => {
      const nextClients = clients.slice(
        loadedClients.length,
        loadedClients.length + 6
      );

      if (nextClients.length > 0) {
        setLoadedClients((prev) => [...prev, ...nextClients]);
      }

      setIsLoading(false); // Garante que o loading seja desativado
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
    <>
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
                <Flex align="center" gap="sm" mb="xs">
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
                  <Button variant="outline" size="xs" fullWidth>
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
    </>
  );
};

export default withAuth(ClientsPage, true);
