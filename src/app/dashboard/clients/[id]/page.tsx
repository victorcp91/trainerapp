"use client";

import {
  Card,
  Text,
  Group,
  Avatar,
  Badge,
  Button,
  Stack,
  Divider,
  Tabs,
  Modal,
  Select,
  Image,
  TextInput,
  Checkbox,
  Switch,
} from "@mantine/core";
import {
  IconShare,
  IconCheck,
  IconTrash,
  IconCalendar,
  IconClock,
  IconBell,
  IconHeart,
  IconAlertCircle,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import html2canvas from "html2canvas";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications"; // Importação para notificações
import { withAuth } from "@/utils/withAuth";

function ClientProfilePage() {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>(""); // Estado para a nova anotação
  const [newNoteDate, setNewNoteDate] = useState<Date | null>(new Date()); // Estado para a data da nova anotação
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false); // Estado para controlar o input
  const [modalOpened, setModalOpened] = useState(false);
  const [beforeDate, setBeforeDate] = useState<string | null>(null);
  const [afterDate, setAfterDate] = useState<string | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<string[]>([
    "front",
    "side",
    "back",
  ]); // Estado para ângulos selecionados
  const [replicateModalOpened, setReplicateModalOpened] = useState(false); // Estado para o modal de replicação
  const [replicateStartDate, setReplicateStartDate] = useState<Date | null>(
    null
  ); // Data de início
  const [replicateEndDate, setReplicateEndDate] = useState<Date | null>(null); // Data de expiração
  const [isClientActive, setIsClientActive] = useState<boolean>(true); // Estado para ativar/desativar cliente

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = searchParams?.get("tab") || "profile";

  const handleTabChange = (value: string | null) => {
    if (value) {
      router.push(`${pathname}?tab=${value}`);
    }
  };

  const angleOptions = [
    { value: "front", label: "Frente" },
    { value: "side", label: "Lado" },
    { value: "back", label: "Costas" },
  ];

  // Tipagem explícita para progressPhotos
  const progressPhotos: Record<
    string,
    { front: string; side: string; back: string }
  > = {
    "03/19": {
      front: "/path/to/photo1-front.jpg",
      side: "/path/to/photo1-side.jpg",
      back: "/path/to/photo1-back.jpg",
    },
    "11/19": {
      front: "/path/to/photo2-front.jpg",
      side: "/path/to/photo2-side.jpg",
      back: "/path/to/photo2-back.jpg",
    },
  };

  const photoDates = Object.keys(progressPhotos);

  const addNote = () => {
    if (newNote.trim() && newNoteDate) {
      const formattedDate = newNoteDate.toLocaleDateString("pt-BR");
      setNotes((prev) => [...prev, `${formattedDate}: ${newNote}`]);
      setNewNote(""); // Limpa o campo de entrada
      setNewNoteDate(new Date()); // Reseta a data para a atual
      setIsAddingNote(false); // Fecha o modo de adicionar
    }
  };

  const deleteNote = (index: number) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoClick = (date: string) => {
    setBeforeDate(date);
    setModalOpened(true);
  };

  const handleGenerateImage = async () => {
    const comparisonElement = document.getElementById("comparison-container");
    if (comparisonElement) {
      const canvas = await html2canvas(comparisonElement);
      const link = document.createElement("a");
      link.download = "comparison.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleShare = () => {
    alert("Funcionalidade de compartilhamento em redes sociais em breve!");
  };

  const handleReplicateSeries = () => {
    if (replicateStartDate && replicateEndDate) {
      alert(
        `Série replicada como rascunho de ${replicateStartDate.toLocaleDateString(
          "pt-BR"
        )} até ${replicateEndDate.toLocaleDateString("pt-BR")}`
      );
      setReplicateModalOpened(false); // Fecha o modal
    } else {
      alert("Por favor, preencha ambas as datas.");
    }
  };

  return (
    <Stack>
      <Group>
        <Group>
          <Avatar radius="xl" size="lg" />
          <Stack>
            <Group>
              <Text size="lg">Ben Andrew</Text>
              {/* Pode ser Presencial, Remoto ou Híbrido */}
              <Badge color="blue">Híbrido</Badge>{" "}
            </Group>
            <Switch
              checked={isClientActive}
              onChange={(event) =>
                setIsClientActive(event.currentTarget.checked)
              }
              label={isClientActive ? "Ativo" : "Inativo"}
              size="sm"
            />
          </Stack>
        </Group>
      </Group>

      {/* Tabs */}
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="profile">Perfil</Tabs.Tab>
          <Tabs.Tab value="training">Treinos</Tabs.Tab>
          <Tabs.Tab value="evolution">Evolução</Tabs.Tab>
          <Tabs.Tab value="anamnesis">Anamnese</Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Panel value="profile" pt="md">
          <Stack>
            {/* Personal Info and Goals */}
            <Group align="flex-start" style={{ alignItems: "stretch" }}>
              {/* Personal Info */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  flex: 1,

                  flexDirection: "column",
                }}
              >
                <Text size="md">Informações Pessoais</Text>
                <Divider my="sm" />
                <Group
                  align="flex-start"
                  style={{ justifyContent: "space-between" }}
                >
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text>Gênero: Masculino</Text>
                    <Group>
                      <Text>Telefone: </Text>
                      <a
                        href="https://wa.me/5511987654321"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "green",
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <IconBrandWhatsapp size={16} />
                        (11) 98765-4321
                      </a>
                    </Group>
                    <Group>
                      <Text>Email:</Text>
                      <Text
                        style={{
                          cursor: "pointer",
                          color: "orange",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "ben.andrew@example.com"
                          );
                          showNotification({
                            title: "E-mail copiado!",
                            message:
                              "O e-mail foi copiado para a área de transferência.",
                            color: "orange",
                            position: "top-right",
                          });
                        }}
                      >
                        ben.andrew@example.com
                      </Text>
                    </Group>
                    <Text>Endereço: São Paulo - SP, Brasil</Text>
                  </Stack>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text>Idade: 30 anos</Text>
                    <Text>Altura: 1,75m</Text>
                    <Text>Peso: 70kg</Text>
                    <Text>BF: 15%</Text>
                  </Stack>
                </Group>
              </Card>

              {/* Goals */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  flex: 1,

                  flexDirection: "column",
                }}
              >
                <Text size="md">Objetivos</Text>
                <Divider my="sm" />
                <Text>1. Correr uma maratona sem parar para caminhar</Text>
                <Text>2. 10km City2Surf Fun Run em menos de 50 minutos</Text>
                <Group mt="sm">
                  <Badge color="blue" variant="light">
                    Weight Loss
                  </Badge>
                  <Badge color="blue" variant="light">
                    Muscle Tone
                  </Badge>
                </Group>
              </Card>
            </Group>

            {/* Notes and New Training */}
            <Group align="flex-start" style={{ alignItems: "stretch" }}>
              {/* Notes */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  flex: 1,

                  flexDirection: "column",
                }}
              >
                <Text size="md">Anotações</Text>
                <Divider my="sm" />
                <Stack>
                  {notes.map((note, index) => (
                    <Group key={index} style={{ width: "100%" }}>
                      <Text
                        size="sm"
                        style={{ flex: 1, wordBreak: "break-word" }}
                      >
                        {note}
                      </Text>
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={() => deleteNote(index)}
                        style={{ alignSelf: "flex-start" }}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Group>
                  ))}
                  {isAddingNote ? (
                    <Group>
                      <DateInput
                        value={newNoteDate}
                        onChange={setNewNoteDate}
                        placeholder="Selecione a data"
                        style={{ width: "150px" }}
                      />
                      <TextInput
                        placeholder="Digite sua anotação"
                        value={newNote}
                        onChange={(e) => setNewNote(e.currentTarget.value)}
                      />
                      <Button variant="light" onClick={addNote}>
                        <IconCheck size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        color="red"
                        onClick={() => {
                          setIsAddingNote(false);
                          setNewNote("");
                          setNewNoteDate(new Date());
                        }}
                      >
                        ✕
                      </Button>
                    </Group>
                  ) : (
                    <Button
                      variant="light"
                      onClick={() => setIsAddingNote(true)}
                      style={{ marginTop: "auto" }}
                    >
                      Adicionar Anotação
                    </Button>
                  )}
                </Stack>
              </Card>

              {/* New Training */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  flex: 1,

                  flexDirection: "column",
                }}
              >
                <Text size="md">Treino</Text>
                <Divider my="sm" />
                <Stack>
                  <Text size="sm" color="green">
                    Status: Em dia
                  </Text>
                  <Text size="sm">Expira em: 25/12/2023</Text>
                  {/* Alternativamente, use as cores e textos abaixo conforme o status:
                      <Text size="sm" color="orange">Status: Perto de vencer</Text>
                      <Text size="sm" color="red">Status: Vencido</Text>
                  */}
                </Stack>
                <Button
                  variant="light"
                  fullWidth
                  mt="sm"
                  style={{ marginTop: "auto" }}
                  onClick={() =>
                    router.push(`/dashboard/clients/clientId/new-plan`)
                  }
                >
                  Criar Nova Série
                </Button>
              </Card>
            </Group>
          </Stack>
        </Tabs.Panel>

        {/* Training Tab */}
        <Tabs.Panel value="training" pt="md">
          <Group
            mt="md"
            grow
            align="flex-start"
            style={{ alignItems: "stretch" }}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="md">Informações de Treino</Text>
              <Divider my="sm" />
              <Group align="flex-start" style={{ alignItems: "stretch" }}>
                <Stack>
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
                <Stack>
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
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden", // Garante que o conteúdo excedente seja tratado
              }}
            >
              <Text size="md">Histórico de Séries</Text>
              <Divider my="sm" />
              <Stack mah="200px" style={{ overflowY: "auto" }}>
                <Group>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Mobilidade</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Iniciado em: 01/01/2023
                      </Text>
                      <Divider orientation="vertical" mx="xs" />
                      <Text size="xs" color="dimmed">
                        Trocado em: 15/01/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Ver Detalhes
                    </Button>
                    <Button variant="light" color="orange" size="xs">
                      Replicar
                    </Button>
                  </Group>
                </Group>
                <Group style={{ width: "100%" }}>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Hipertrofia</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Iniciado em: 16/01/2023
                      </Text>
                      <Divider orientation="vertical" mx="xs" />
                      <Text size="xs" color="dimmed">
                        Trocado em: 01/02/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Ver Detalhes
                    </Button>
                    <Button variant="light" color="orange" size="xs">
                      Replicar
                    </Button>
                  </Group>
                </Group>
                <Group style={{ width: "100%" }}>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Hipertrofia</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Iniciado em: 02/02/2023
                      </Text>
                      <Divider orientation="vertical" mx="xs" />
                      <Text size="xs" color="dimmed">
                        Trocado em: 15/02/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Ver Detalhes
                    </Button>
                    <Button variant="light" color="orange" size="xs">
                      Replicar
                    </Button>
                  </Group>
                </Group>
                {/* Exemplos adicionais */}
                <Group style={{ width: "100%" }}>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Resistência</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Iniciado em: 20/02/2023
                      </Text>
                      <Divider orientation="vertical" mx="xs" />
                      <Text size="xs" color="dimmed">
                        Trocado em: 10/03/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Ver Detalhes
                    </Button>
                    <Button variant="light" color="orange" size="xs">
                      Replicar
                    </Button>
                  </Group>
                </Group>
                <Group style={{ width: "100%" }}>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Cardio</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Iniciado em: 15/03/2023
                      </Text>
                      <Divider orientation="vertical" mx="xs" />
                      <Text size="xs" color="dimmed">
                        Trocado em: 01/04/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Ver Detalhes
                    </Button>
                    <Button variant="light" color="orange" size="xs">
                      Replicar
                    </Button>
                  </Group>
                </Group>
              </Stack>
            </Card>
          </Group>

          {/* New Row with Two Cards */}
          <Group
            mt="md"
            grow
            align="flex-start"
            style={{ alignItems: "stretch" }}
          >
            {/* Current Training Card */}
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ flex: 1 }}
            >
              <Text size="md">Série Atual: Hipertrofia</Text>
              <Divider my="sm" />
              <Stack>
                <Group>
                  <Text size="sm" color="green">
                    Status: Em dia
                  </Text>
                  <Divider orientation="vertical" mx="xs" />
                  <Text size="xs" color="dimmed">
                    Iniciado em: 01/03/2023
                  </Text>
                  <Divider orientation="vertical" mx="xs" />
                  <Text size="xs" color="dimmed">
                    Expira em: 01/06/2023
                  </Text>
                </Group>
                <Group mt="sm">
                  <Button variant="light" color="blue" size="xs">
                    Ver Detalhes
                  </Button>
                  <Button variant="light" color="teal" size="xs">
                    Gerar PDF
                  </Button>
                  <Button
                    variant="light"
                    color="orange"
                    size="xs"
                    onClick={() => setReplicateModalOpened(true)} // Abre o modal ao clicar
                  >
                    Replicar
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    onClick={() => alert("Série marcada como expirada.")}
                  >
                    Expirar
                  </Button>
                </Group>
                <Button
                  variant="filled"
                  color="green"
                  size="md"
                  leftSection={<IconCheck size={16} />}
                  mt="lg"
                  onClick={() =>
                    router.push(`/dashboard/clients/clientId/new-plan`)
                  }
                >
                  Criar Nova Série
                </Button>
              </Stack>
            </Card>

            {/* Drafts Card */}
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ flex: 1 }}
            >
              <Text size="md">Rascunhos</Text>
              <Divider my="sm" />
              <Stack>
                <Group style={{ width: "100%" }}>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Treino de Força</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Criado em: 10/03/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Editar
                    </Button>
                    <Button variant="light" color="green" size="xs">
                      Publicar
                    </Button>
                    <Button variant="light" color="red" size="xs">
                      Excluir
                    </Button>
                  </Group>
                </Group>
                <Group style={{ width: "100%" }}>
                  <Stack style={{ flex: 1, gap: "4px" }}>
                    <Text size="sm">Treino de Resistência</Text>
                    <Group>
                      <Text size="xs" color="dimmed">
                        Criado em: 15/03/2023
                      </Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Button variant="light" color="blue" size="xs">
                      Editar
                    </Button>
                    <Button variant="light" color="green" size="xs">
                      Publicar
                    </Button>
                    <Button variant="light" color="red" size="xs">
                      Excluir
                    </Button>
                  </Group>
                </Group>
              </Stack>
              <Button
                variant="light"
                fullWidth
                mt="sm"
                onClick={() =>
                  router.push(`/dashboard/clients/clientId/new-plan`)
                }
              >
                Criar Novo Rascunho
              </Button>
            </Card>
          </Group>
        </Tabs.Panel>

        {/* Anamnesis Tab */}
        <Tabs.Panel value="anamnesis" pt="md">
          <Stack>
            <Group grow align="flex-start" style={{ alignItems: "stretch" }}>
              {/* 🧠 Objetivo e experiência */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Text size="md">🧠 Objetivo e Experiência</Text>
                <Divider my="sm" />
                <Stack>
                  <Select
                    label="Objetivo principal:"
                    placeholder="Selecione o objetivo"
                    data={[
                      { value: "hipertrofia", label: "Hipertrofia" },
                      { value: "emagrecimento", label: "Emagrecimento" },
                      { value: "forca", label: "Força" },
                      { value: "resistencia", label: "Resistência muscular" },
                      {
                        value: "condicionamento",
                        label: "Condicionamento físico geral",
                      },
                    ]}
                  />
                  <Select
                    label="Nível de experiência:"
                    placeholder="Selecione o nível"
                    data={[
                      {
                        value: "iniciante",
                        label: "Iniciante (Menos de 6 meses)",
                      },
                      {
                        value: "intermediario",
                        label: "Intermediário (6m a 2 anos)",
                      },
                      { value: "avancado", label: "Avançado (+2 anos)" },
                    ]}
                  />
                </Stack>
              </Card>

              {/* 📅 Frequência e tempo */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Text size="md">📅 Frequência e Tempo</Text>
                <Divider my="sm" />
                <Stack>
                  <Checkbox.Group
                    label="Quais dias da semana o aluno pode treinar?"
                    description="Selecione os dias disponíveis"
                  >
                    <Group mt="md">
                      <Checkbox value="Segunda" label="Segunda" />
                      <Checkbox value="Terça" label="Terça" />
                      <Checkbox value="Quarta" label="Quarta" />
                      <Checkbox value="Quinta" label="Quinta" />
                      <Checkbox value="Sexta" label="Sexta" />
                      <Checkbox value="Sábado" label="Sábado" />
                      <Checkbox value="Domingo" label="Domingo" />
                    </Group>
                  </Checkbox.Group>
                  <TextInput
                    label="Tempo disponível por treino (em minutos):"
                    placeholder="Ex: 45"
                    type="number"
                  />
                </Stack>
              </Card>
            </Group>

            <Group grow align="flex-start" style={{ alignItems: "stretch" }}>
              {/* 🏋️ Foco muscular e treino */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Text size="md">🏋️ Foco Muscular e Treino</Text>
                <Divider my="sm" />
                <Stack>
                  <Checkbox.Group
                    label="Deseja dar foco a algum grupo muscular específico?"
                    style={{ flexWrap: "wrap", gap: "16px" }}
                  >
                    <Group mt="md">
                      <Checkbox
                        key="Peitoral"
                        value="Peitoral"
                        label="Peitoral"
                      />
                      <Checkbox key="Costas" value="Costas" label="Costas" />
                      <Checkbox key="Ombros" value="Ombros" label="Ombros" />
                      <Checkbox key="Bíceps" value="Bíceps" label="Bíceps" />
                      <Checkbox key="Tríceps" value="Tríceps" label="Tríceps" />
                      <Checkbox key="Abdômen" value="Abdômen" label="Abdômen" />
                      <Checkbox key="Glúteos" value="Glúteos" label="Glúteos" />
                      <Checkbox
                        key="Quadríceps"
                        value="Quadríceps"
                        label="Quadríceps"
                      />

                      <Checkbox
                        key="Posteriores de coxa"
                        value="Posteriores de coxa"
                        label="Posteriores de coxa"
                      />

                      <Checkbox
                        key="Panturrilhas"
                        value="Panturrilhas"
                        label="Panturrilhas"
                      />
                    </Group>
                  </Checkbox.Group>
                  <Select
                    label="Equipamento disponível:"
                    placeholder="Selecione o equipamento"
                    data={[
                      { value: "sem_equipamento", label: "Sem equipamentos" },
                      { value: "pesos_livres", label: "Pesos livres em casa" },
                      {
                        value: "academia_completa",
                        label: "Academia completa",
                      },
                    ]}
                  />
                </Stack>
              </Card>

              {/* 🫀 Cardio */}
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Text size="md">🫀 Cardio</Text>
                <Divider my="sm" />
                <Stack>
                  <Select
                    label="Qual a relação do aluno com o cardio?"
                    placeholder="Selecione uma opção"
                    data={[
                      { value: "regular", label: "Faço regularmente" },
                      { value: "as_vezes", label: "Faço às vezes" },
                      { value: "nao_faco", label: "Não faço" },
                    ]}
                  />
                  <Checkbox.Group
                    label="Preferências de cardio:"
                    style={{ flexWrap: "wrap", gap: "16px" }}
                  >
                    <Group mt="md">
                      <Checkbox
                        value="Caminhada/corrida ao ar livre"
                        label="Caminhada/corrida ao ar livre"
                      />
                      <Checkbox value="esteira ergométrica" label="Esteira" />
                      <Checkbox value="ciclismo" label="Ciclismo" />
                      <Checkbox
                        value="ciclismo indoor"
                        label="Ciclismo indoor"
                      />
                      <Checkbox value="HIIT" label="HIIT" />
                      <Checkbox value="Elíptico" label="Elíptico" />
                      <Checkbox value="escada" label="Escada" />
                      <Checkbox value="outros" label="Outros" />
                    </Group>
                  </Checkbox.Group>
                  <TextInput
                    label="Se outros, especifique:"
                    placeholder="Descreva suas preferências de cardio"
                    style={{ marginTop: "8px" }}
                  />
                </Stack>
              </Card>
            </Group>

            <Group grow align="flex-start">
              {/* 🚫 Restrições */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="md">🚫 Restrições</Text>
                <Divider my="sm" />
                <TextInput
                  label="Possui alguma lesão ou limitação física?"
                  placeholder="Descreva se houver algo importante a considerar"
                />
              </Card>
            </Group>

            {/* Botão de salvar */}
            <Button variant="filled" color="blue" mt="md">
              Salvar Todas as Edições
            </Button>
          </Stack>
        </Tabs.Panel>

        {/* Evolução Tab */}
        <Tabs.Panel value="evolution" pt="md">
          <Stack>
            {/* Progress Photos */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="md">Progresso</Text>
              <Divider my="sm" />
              <Group>
                {photoDates.map((date) => (
                  <Card
                    key={date}
                    shadow="sm"
                    padding="sm"
                    onClick={() => handlePhotoClick(date)}
                    style={{ cursor: "pointer" }}
                  >
                    <Text size="sm">{date}</Text>
                    <Avatar
                      src={progressPhotos[date].front}
                      size={100}
                      radius="md"
                    />
                  </Card>
                ))}
              </Group>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Modal for Progress Photos Comparison */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Comparação de Fotos de Progresso"
        size="lg"
      >
        <Group grow>
          <Select
            label="Data Antes"
            placeholder="Selecione uma data"
            data={photoDates}
            value={beforeDate}
            onChange={setBeforeDate}
          />
          <Select
            label="Data Depois"
            placeholder="Selecione uma data"
            data={photoDates}
            value={afterDate}
            onChange={setAfterDate}
          />
        </Group>
        <Divider my="sm" />
        <Text size="sm">Ângulos</Text>
        <Group>
          {angleOptions.map((angle) => (
            <Checkbox
              key={angle.value}
              label={angle.label}
              checked={selectedAngles.includes(angle.value)}
              onChange={(e) => {
                const isChecked = e.currentTarget.checked;
                setSelectedAngles((prev) =>
                  isChecked
                    ? [...prev, angle.value]
                    : prev.filter((a) => a !== angle.value)
                );
              }}
            />
          ))}
        </Group>
        <Divider my="sm" />
        <div id="comparison-container">
          <Group align="flex-start">
            {beforeDate && (
              <Stack>
                <Text size="sm">Antes ({beforeDate})</Text>
                {selectedAngles.includes("front") && (
                  <Image
                    src={progressPhotos[beforeDate].front}
                    alt="Frente Antes"
                  />
                )}
                {selectedAngles.includes("side") && (
                  <Image
                    src={progressPhotos[beforeDate].side}
                    alt="Lado Antes"
                  />
                )}
                {selectedAngles.includes("back") && (
                  <Image
                    src={progressPhotos[beforeDate].back}
                    alt="Costas Antes"
                  />
                )}
              </Stack>
            )}
            {afterDate && (
              <Stack>
                <Text size="sm">Depois ({afterDate})</Text>
                {selectedAngles.includes("front") && (
                  <Image
                    src={progressPhotos[afterDate].front}
                    alt="Frente Depois"
                  />
                )}
                {selectedAngles.includes("side") && (
                  <Image
                    src={progressPhotos[afterDate].side}
                    alt="Lado Depois"
                  />
                )}
                {selectedAngles.includes("back") && (
                  <Image
                    src={progressPhotos[afterDate].back}
                    alt="Costas Depois"
                  />
                )}
              </Stack>
            )}
          </Group>
        </div>
        <Divider my="sm" />
        <Group>
          <Button onClick={handleGenerateImage}>Gerar Imagem</Button>
          <Button
            leftSection={<IconShare size={16} />}
            variant="outline"
            onClick={handleShare}
          >
            Compartilhar
          </Button>
        </Group>
      </Modal>

      {/* Modal para replicar série */}
      <Modal
        opened={replicateModalOpened}
        onClose={() => setReplicateModalOpened(false)}
        title="Replicar Série"
      >
        <Stack>
          <DateInput
            label="Data de Início"
            placeholder="Selecione a data de início"
            value={replicateStartDate}
            onChange={setReplicateStartDate}
          />
          <DateInput
            label="Data de Expiração"
            placeholder="Selecione a data de expiração"
            value={replicateEndDate}
            onChange={setReplicateEndDate}
          />
          <Button onClick={handleReplicateSeries} variant="filled" color="blue">
            Confirmar
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default withAuth(ClientProfilePage, true);
