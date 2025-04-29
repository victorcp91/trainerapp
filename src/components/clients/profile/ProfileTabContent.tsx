import React from "react";
import {
  Stack,
  Group,
  Card,
  Text,
  Divider,
  Button,
  Badge,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconTrash, IconCheck, IconBrandWhatsapp } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications"; // For email copy notification
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"; // Type for router
import { useTranslations } from "next-intl";

// Props required by this tab content
interface ProfileTabContentProps {
  notes: string[];
  newNote: string;
  newNoteDate: Date | null;
  isAddingNote: boolean;
  setNotes: React.Dispatch<React.SetStateAction<string[]>>;
  setNewNote: React.Dispatch<React.SetStateAction<string>>;
  setNewNoteDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setIsAddingNote: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  // Add any other required props, e.g., client data for info cards if needed
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  notes,
  newNote,
  newNoteDate,
  isAddingNote,
  setNotes,
  setNewNote,
  setNewNoteDate,
  setIsAddingNote,
  router,
}) => {
  const t = useTranslations();
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

  return (
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text size="md">Informações Pessoais</Text>
          <Divider my="sm" />
          <Group align="flex-start" style={{ justifyContent: "space-between" }}>
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
                    navigator.clipboard.writeText("ben.andrew@example.com");
                    showNotification({
                      title: "E-mail copiado!",
                      message:
                        "O e-mail foi copiado para a área de transferência.",
                      color: "orange",
                      // position: "top-right", // Optional: Mantine default might be fine
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text size="md">{t("clientProfile.profile.goals")}</Text>
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text size="md">Anotações</Text>
          <Divider my="sm" />
          <Stack style={{ flexGrow: 1 }}>
            {/* Allow stack to grow */}
            {notes.map((note, index) => (
              <Group key={index} style={{ width: "100%" }} wrap="nowrap">
                <Text size="sm" style={{ flex: 1, wordBreak: "break-word" }}>
                  {note}
                </Text>
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => deleteNote(index)}
                  style={{ alignSelf: "flex-start" }}
                  px={4} // Reduce padding
                  aria-label={`Excluir nota ${index + 1}`}
                >
                  <IconTrash size={16} />
                </Button>
              </Group>
            ))}
            {isAddingNote ? (
              <Group wrap="nowrap">
                {/* Prevent wrapping */}
                <DateInput
                  value={newNoteDate}
                  onChange={setNewNoteDate}
                  placeholder={t("clientProfile.profile.selectDatePlaceholder")}
                  maw={150} // Max width for date
                  required
                />
                <TextInput
                  placeholder="Digite sua anotação"
                  value={newNote}
                  onChange={(e) => setNewNote(e.currentTarget.value)}
                  style={{ flexGrow: 1 }} // Allow text input to grow
                  required
                />
                <Button
                  variant="light"
                  onClick={addNote}
                  px={6}
                  aria-label={t("clientProfile.profile.addNoteAriaLabel")}
                >
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
                  px={6}
                  aria-label="Cancelar adição de nota"
                >
                  ✕
                </Button>
              </Group>
            ) : (
              <Button
                variant="light"
                onClick={() => setIsAddingNote(true)}
                mt="auto" // Push button to bottom
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Ensure content spacing
          }}
        >
          <Text size="md">{t("clientProfile.profile.training")}</Text>
          <Divider my="sm" />
          <Stack style={{ flexGrow: 1 }}>
            {/* Allow stack to grow */}
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
            style={{ marginTop: "auto" }} // Push button to bottom
            onClick={
              () => router.push(`/dashboard/clients/clientId/new-plan`) // Use dynamic client ID later
            }
          >
            Criar Nova Série
          </Button>
        </Card>
      </Group>
    </Stack>
  );
};

export default ProfileTabContent;
