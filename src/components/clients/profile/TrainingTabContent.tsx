import React from "react";
import { Card, Text, Group, Stack, Divider, Button } from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconBell,
  IconHeart,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Mock data structure for training history item
interface TrainingHistoryItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// Mock data structure for draft item
interface DraftItem {
  id: string;
  name: string;
  createdAt: string;
}

interface TrainingTabContentProps {
  router: AppRouterInstance;
  setReplicateModalOpened: (opened: boolean) => void;
  // Add props for dynamic data: trainingInfo, history, currentTraining, drafts
  // trainingInfo: { availableDays: string; timePerSession: string; equipment: string; cardio: string; restrictions: string };
  // history: TrainingHistoryItem[];
  // currentTraining: { name: string; status: string; startDate: string; expiryDate: string; };
  // drafts: DraftItem[];
}

const TrainingTabContent: React.FC<TrainingTabContentProps> = ({
  router,
  setReplicateModalOpened,
  // Destructure dynamic data props here when added
}) => {
  // Replace with dynamic data passed via props
  const mockHistory: TrainingHistoryItem[] = [
    {
      id: "1",
      name: "Mobilidade",
      startDate: "01/01/2023",
      endDate: "15/01/2023",
    },
    {
      id: "2",
      name: "Hipertrofia",
      startDate: "16/01/2023",
      endDate: "01/02/2023",
    },
    {
      id: "3",
      name: "Hipertrofia",
      startDate: "02/02/2023",
      endDate: "15/02/2023",
    },
    {
      id: "4",
      name: "Resistência",
      startDate: "20/02/2023",
      endDate: "10/03/2023",
    },
    { id: "5", name: "Cardio", startDate: "15/03/2023", endDate: "01/04/2023" },
  ];

  const mockDrafts: DraftItem[] = [
    { id: "d1", name: "Treino de Força", createdAt: "10/03/2023" },
    { id: "d2", name: "Treino de Resistência", createdAt: "15/03/2023" },
  ];

  return (
    <>
      <Group mt="md" grow align="flex-start" style={{ alignItems: "stretch" }}>
        {/* Training Info Card */}
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

        {/* Training History Card */}
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Text size="md">Histórico de Séries</Text>
          <Divider my="sm" />
          <Stack mah="200px" style={{ overflowY: "auto" }}>
            {mockHistory.map((item) => (
              <Group key={item.id}>
                <Stack style={{ flex: 1, gap: "4px" }}>
                  <Text size="sm">{item.name}</Text>
                  <Group>
                    <Text size="xs" color="dimmed">
                      Iniciado em: {item.startDate}
                    </Text>
                    <Divider orientation="vertical" mx="xs" />
                    <Text size="xs" color="dimmed">
                      Trocado em: {item.endDate}
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
            ))}
          </Stack>
        </Card>
      </Group>

      {/* New Row with Two Cards */}
      <Group mt="md" grow align="flex-start" style={{ alignItems: "stretch" }}>
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
                onClick={() => setReplicateModalOpened(true)}
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
              onClick={
                () => router.push(`/dashboard/clients/clientId/new-plan`) // Use dynamic ID
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
            {mockDrafts.map((draft) => (
              <Group key={draft.id} style={{ width: "100%" }}>
                <Stack style={{ flex: 1, gap: "4px" }}>
                  <Text size="sm">{draft.name}</Text>
                  <Group>
                    <Text size="xs" color="dimmed">
                      Criado em: {draft.createdAt}
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
            ))}
          </Stack>
          <Button
            variant="light"
            fullWidth
            mt="sm"
            onClick={
              () => router.push(`/dashboard/clients/clientId/new-plan`) // Use dynamic ID
            }
          >
            Criar Novo Rascunho
          </Button>
        </Card>
      </Group>
    </>
  );
};

export default TrainingTabContent;
