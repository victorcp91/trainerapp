"use client";

import React from "react";
import { withAuth } from "@/utils/withAuth";
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Center,
  RingProgress,
  Badge,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  IconUsers,
  IconGymnastics,
  IconCalendar,
  IconClock,
  IconBell,
} from "@tabler/icons-react";

const DashboardPage = () => {
  const router = useRouter();

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md">
        Bem-vindo de volta, John Doe
      </Title>
      <Text c="dimmed" mb="xl">
        Quinta-feira, 10 de abril de 2025
      </Text>

      <Grid gutter="md" align="stretch">
        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconUsers size={24} color="blue" />
              <Title
                order={4}
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/dashboard/clientes")}
              >
                Clientes Ativos
              </Title>
            </Group>
            <Group>
              <Text size="xl">3</Text>
              <Badge color="blue" variant="light">
                Total
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              Total de clientes registrados
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconGymnastics size={24} color="orange" />
              <Title order={4}>Treinos Pendentes</Title>
            </Group>
            <Group>
              <Text size="xl">2</Text>
              <Badge
                color="orange"
                variant="light"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push("/dashboard/clients?seriesStatus=near_due")
                }
              >
                Em breve
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              Treinos a serem preparados em breve
            </Text>
            <Group mt="sm">
              <Text size="lg">1</Text>
              <Badge
                color="red"
                variant="light"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push("/dashboard/clients?seriesStatus=overdue")
                }
              >
                Atrasados
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              Treinos atrasados
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconCalendar size={24} color="green" />
              <Title order={4}>Atendimentos hoje</Title>
            </Group>
            <RingProgress
              sections={[{ value: 90, color: "green" }]}
              label={
                <Text size="xl" style={{ textAlign: "center" }}>
                  90%
                </Text>
              }
            />
            <Text c="dimmed" size="sm" mt="sm">
              De 3 sessões totais
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconClock size={24} color="gray" />
              <Title order={4}>Próxima Sessão</Title>
            </Group>
            <Text size="xl">--:--</Text>
            <Text c="dimmed" size="sm">
              Sem mais sessões hoje
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md" align="stretch">
        <Grid.Col style={{ flexBasis: "50%", maxWidth: "50%" }}>
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconBell size={24} color="blue" />
              <Title order={4}>Agenda de Hoje</Title>
            </Group>
            <Center>
              <Text c="dimmed">Nenhuma sessão agendada para hoje</Text>
            </Center>
          </Card>
        </Grid.Col>

        <Grid.Col style={{ flexBasis: "50%", maxWidth: "50%" }}>
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconBell size={24} color="orange" />
              <Title order={4}>Notificações</Title>
            </Group>
            <Text c="dimmed" size="sm">
              Maria: Novo treino em 2 dias
            </Text>
            <Text c="dimmed" size="sm">
              Carlos: Falta na última sessão
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md">
        <Grid.Col>
          <Card shadow="sm" padding="lg">
            <Title order={4} mb="sm">
              Agenda Semanal
            </Title>
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <Text>Segunda-feira</Text>
                <Text c="dimmed" size="sm">
                  10:00 - 11:00
                </Text>
                <Text c="dimmed" size="sm">
                  15:00 - 16:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Terça-feira</Text>
                <Text c="dimmed" size="sm">
                  14:00 - 15:00
                </Text>
                <Text c="dimmed" size="sm">
                  17:00 - 18:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Quarta-feira</Text>
                <Text c="dimmed" size="sm">
                  09:00 - 10:00
                </Text>
                <Text c="dimmed" size="sm">
                  13:00 - 14:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Quinta-feira</Text>
                <Text c="dimmed" size="sm">
                  16:00 - 17:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Sexta-feira</Text>
                <Text c="dimmed" size="sm">
                  13:00 - 14:00
                </Text>
                <Text c="dimmed" size="sm">
                  18:00 - 19:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Sábado</Text>
                <Text c="dimmed" size="sm">
                  10:00 - 11:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Domingo</Text>
                <Text c="dimmed" size="sm">
                  Sem sessões
                </Text>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default withAuth(DashboardPage, true);
