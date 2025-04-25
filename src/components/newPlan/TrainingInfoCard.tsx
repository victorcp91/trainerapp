import { Card, Text, Group, Stack, Divider } from "@mantine/core";
import {
  IconStar,
  IconCalendar,
  IconClock,
  IconBell,
  IconHeart,
  IconAlertCircle,
} from "@tabler/icons-react";

export function TrainingInfoCard() {
  return (
    <Card shadow="sm" padding="lg">
      <Text size="md">Informações de Treino</Text>
      <Divider my="sm" />
      <Group align="flex-start" style={{ alignItems: "stretch" }}>
        <Stack style={{ flex: 1 }}>
          <Group>
            <IconCalendar size={20} />
            <Text size="sm">
              <strong>Dias disponíveis:</strong> Segunda-feira, Quarta-feira,
              Sexta-feira
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
  );
}
