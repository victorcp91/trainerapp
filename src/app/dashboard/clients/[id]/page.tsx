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
} from "@tabler/icons-react";
import html2canvas from "html2canvas";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";

export default function ClientProfilePage() {
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

  const router = useRouter();

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

  return (
    <Stack>
      <Group>
        <Group>
          <Avatar radius="xl" size="lg" />
          <Stack>
            <Text size="lg">Ben Andrew</Text>
            <Badge color="blue">Híbrido</Badge>{" "}
            {/* Pode ser Presencial, Remoto ou Híbrido */}
          </Stack>
        </Group>
      </Group>

      {/* Tabs */}
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile">Perfil</Tabs.Tab>
          <Tabs.Tab value="training">Treinos</Tabs.Tab>
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
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text size="md">Informações Pessoais</Text>
                <Divider my="sm" />
                <Group
                  align="flex-start"
                  style={{ justifyContent: "space-between" }}
                >
                  <Stack style={{ flex: 1 }}>
                    <Text>Idade: 30 anos</Text>
                    <Text>Sexo: Masculino</Text>
                    <Text>Telefone: (11) 98765-4321</Text>
                    <Text>Email: ben.andrew@example.com</Text>
                  </Stack>
                  <Stack style={{ flex: 1 }}>
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
                style={{
                  flex: 1,
                  display: "flex",
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
                style={{
                  flex: 1,
                  display: "flex",
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
                        style={{ flex: 1 }}
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
                style={{
                  flex: 1,
                  display: "flex",
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

            {/* Progress Photos */}
            <Card shadow="sm" padding="lg">
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

        {/* Training Tab */}
        <Tabs.Panel value="training" pt="md">
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
                  <IconHeart size={20} />
                  <Text size="sm">
                    <strong>Cardio:</strong> Esteira, Bicicleta
                  </Text>
                </Group>
                <Group>
                  <IconAlertCircle size={20} />
                  <Text size="sm">
                    <strong>Lesões:</strong> Nenhuma
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Card>

          {/* New Row with Two Cards */}
          <Group mt="md" grow align="flex-start">
            {/* Current Training Card */}
            <Card shadow="sm" padding="lg" style={{ flex: 1 }}>
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
                  <Button variant="light" color="orange" size="xs">
                    Duplicar Série
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

            {/* Training History Card */}
            <Card shadow="sm" padding="lg" style={{ flex: 1 }}>
              <Text size="md">Histórico de Séries</Text>
              <Divider my="sm" />
              <Stack>
                <Group style={{ width: "100%" }}>
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
                      Duplicar
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
                      Duplicar
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
                      Duplicar
                    </Button>
                  </Group>
                </Group>
              </Stack>
            </Card>
          </Group>
        </Tabs.Panel>

        {/* Anamnesis Tab */}
        <Tabs.Panel value="anamnesis" pt="md">
          <Card shadow="sm" padding="lg">
            <Text size="md">Informações de Treino</Text>
            <Divider my="sm" />
            <Stack>
              {/* Dias da semana disponíveis */}
              <Group>
                <IconCalendar size={20} />
                <Text size="sm">
                  <strong>Dias disponíveis:</strong> Segunda, Quarta, Sexta
                </Text>
              </Group>

              {/* Tempo disponível por treino */}
              <Group>
                <IconClock size={20} />
                <Text size="sm">
                  <strong>Tempo por treino:</strong> 1 hora
                </Text>
              </Group>

              {/* Equipamento disponível */}
              <Group>
                <IconBell size={20} />
                <Text size="sm">
                  <strong>Equipamento:</strong> Pesos livres
                </Text>
              </Group>

              {/* Preferência de cardio */}
              <Group>
                <IconHeart size={20} />
                <Text size="sm">
                  <strong>Cardio:</strong> Esteira, Bicicleta
                </Text>
              </Group>

              {/* Lesões */}
              <Group>
                <IconAlertCircle size={20} />
                <Text size="sm">
                  <strong>Lesões:</strong> Nenhuma
                </Text>
              </Group>
            </Stack>
          </Card>
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
    </Stack>
  );
}
