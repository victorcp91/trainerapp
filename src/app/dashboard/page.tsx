"use client";

import React from "react";
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
import { useTranslations } from "next-intl";

const DashboardPage = () => {
  const router = useRouter();
  const t = useTranslations("DashboardPage");

  const userName = "John Doe";
  const currentDate = new Date();
  const activeClientsCount = 3;
  const nearDueWorkouts = 2;
  const overdueWorkouts = 1;
  const todaySessionsCompleted = 2;
  const todaySessionsTotal = 3;
  const todayAttendancePercentage =
    todaySessionsTotal > 0
      ? (todaySessionsCompleted / todaySessionsTotal) * 100
      : 0;
  const notificationExample1Name = "Maria";
  const notificationExample1Days = 2;
  const notificationExample2Name = "Carlos";

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentDate);

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        {t("welcomeBack", { name: userName })}
      </Title>
      <Text c="dimmed" mb="xl">
        {t("currentDate", { date: formattedDate })}
      </Text>

      <Grid gutter="md" align="stretch">
        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card withBorder shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconUsers size={24} color="blue" />
              <Title
                order={4}
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/dashboard/clients")}
              >
                {t("activeClients")}
              </Title>
            </Group>
            <Group>
              <Text size="xl">{activeClientsCount}</Text>
              <Badge color="blue" variant="light">
                {t("totalBadge")}
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              {t("totalClientsRegistered")}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card withBorder shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconGymnastics size={24} color="orange" />
              <Title order={4}>{t("pendingWorkouts")}</Title>
            </Group>
            <Group>
              <Text size="xl">{nearDueWorkouts}</Text>
              <Badge
                color="orange"
                variant="light"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push("/dashboard/clients?seriesStatus=near_due")
                }
              >
                {t("nearDueBadge")}
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              {t("nearDueDescription")}
            </Text>
            <Group mt="sm">
              <Text size="lg">{overdueWorkouts}</Text>
              <Badge
                color="red"
                variant="light"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push("/dashboard/clients?seriesStatus=overdue")
                }
              >
                {t("overdueBadge")}
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              {t("overdueDescription")}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card withBorder shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconCalendar size={24} color="green" />
              <Title order={4}>{t("attendancesToday")}</Title>
            </Group>
            <RingProgress
              sections={[{ value: todayAttendancePercentage, color: "green" }]}
              label={
                <Text size="xl" style={{ textAlign: "center" }}>
                  {Math.round(todayAttendancePercentage)}%
                </Text>
              }
            />
            <Text c="dimmed" size="sm" mt="sm">
              {t("ofTotalSessions", { count: todaySessionsTotal })}
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card withBorder shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconClock size={24} color="gray" />
              <Title order={4}>{t("nextSession")}</Title>
            </Group>
            <Text size="xl">--:--</Text>
            <Text c="dimmed" size="sm">
              {t("noMoreSessionsToday")}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md" align="stretch" mt="md">
        <Grid.Col style={{ flexBasis: "50%", maxWidth: "50%" }}>
          <Card withBorder shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconBell size={24} color="blue" />
              <Title order={4}>{t("todaySchedule")}</Title>
            </Group>
            <Center>
              <Text c="dimmed">{t("noSessionsScheduled")}</Text>
            </Center>
          </Card>
        </Grid.Col>

        <Grid.Col style={{ flexBasis: "50%", maxWidth: "50%" }}>
          <Card withBorder shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Group align="center" gap={5} mb="sm">
              <IconBell size={24} color="orange" />
              <Title order={4}>{t("notifications")}</Title>
            </Group>
            <Text c="dimmed" size="sm">
              {t("notificationExample1", {
                name: notificationExample1Name,
                days: notificationExample1Days,
              })}
            </Text>
            <Text c="dimmed" size="sm">
              {t("notificationExample2", { name: notificationExample2Name })}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md" mt="md">
        <Grid.Col>
          <Card withBorder shadow="sm" padding="lg">
            <Title order={4} mb="sm">
              {t("weeklySchedule")}
            </Title>
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <Text>{t("monday")}</Text>
                <Text c="dimmed" size="sm">
                  10:00 - 11:00
                </Text>
                <Text c="dimmed" size="sm">
                  15:00 - 16:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{t("tuesday")}</Text>
                <Text c="dimmed" size="sm">
                  14:00 - 15:00
                </Text>
                <Text c="dimmed" size="sm">
                  17:00 - 18:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{t("wednesday")}</Text>
                <Text c="dimmed" size="sm">
                  09:00 - 10:00
                </Text>
                <Text c="dimmed" size="sm">
                  13:00 - 14:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{t("thursday")}</Text>
                <Text c="dimmed" size="sm">
                  16:00 - 17:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{t("friday")}</Text>
                <Text c="dimmed" size="sm">
                  13:00 - 14:00
                </Text>
                <Text c="dimmed" size="sm">
                  18:00 - 19:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{t("saturday")}</Text>
                <Text c="dimmed" size="sm">
                  10:00 - 11:00
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>{t("sunday")}</Text>
                <Text c="dimmed" size="sm">
                  {t("noSessions")}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
