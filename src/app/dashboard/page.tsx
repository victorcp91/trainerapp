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
} from "@mantine/core";

const DashboardPage = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md">
        Welcome back, John Doe
      </Title>
      <Text color="dimmed" mb="xl">
        Thursday, April 10, 2025
      </Text>

      <Grid gutter="md" align="stretch">
        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Active Clients
            </Title>
            <Group>
              <Text size="lg">Active Clients</Text>
              <Text size="xl">3</Text>
            </Group>
            <Text color="dimmed" size="sm">
              Total registered clients
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Pending Workouts
            </Title>
            <Text size="lg">2</Text>
            <Text color="dimmed" size="sm">
              Workouts to be prepared soon
            </Text>
            <Text size="lg" mt="sm">
              1
            </Text>
            <Text color="dimmed" size="sm">
              Overdue workouts
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Attendance Rate
            </Title>
            <Group>
              <Text size="lg">Attendance Rate</Text>
              <Text size="xl">100%</Text>
            </Group>
            <Text color="dimmed" size="sm">
              From 3 total sessions
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col
          style={{ flex: "1 1 25%", maxWidth: "25%" }}
          className="col-mobile-50"
        >
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Next Session
            </Title>
            <Group>
              <Text size="lg">Next Session</Text>
              <Text size="xl">--:--</Text>
            </Group>
            <Text color="dimmed" size="sm">
              No more sessions today
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md" align="stretch">
        <Grid.Col style={{ flexBasis: "50%", maxWidth: "50%" }}>
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Today&apos;s Schedule
            </Title>
            <Center>
              <Text color="dimmed">No sessions scheduled for today</Text>
            </Center>
          </Card>
        </Grid.Col>

        <Grid.Col style={{ flexBasis: "50%", maxWidth: "50%" }}>
          <Card shadow="sm" padding="lg" style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Notifications
            </Title>
            <Text color="dimmed" size="sm">
              Maria: Novo treino em 2 dias
            </Text>
            <Text color="dimmed" size="sm">
              Carlos: Falta na última sessão
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="md">
        <Grid.Col>
          <Card shadow="sm" padding="lg">
            <Title order={4} mb="sm">
              Weekly Schedule
            </Title>
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <Text>Monday</Text>
                <Text color="dimmed" size="sm">
                  10:00 AM - 11:00 AM
                </Text>
                <Text color="dimmed" size="sm">
                  3:00 PM - 4:00 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Tuesday</Text>
                <Text color="dimmed" size="sm">
                  2:00 PM - 3:00 PM
                </Text>
                <Text color="dimmed" size="sm">
                  5:00 PM - 6:00 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Wednesday</Text>
                <Text color="dimmed" size="sm">
                  9:00 AM - 10:00 AM
                </Text>
                <Text color="dimmed" size="sm">
                  1:00 PM - 2:00 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Thursday</Text>
                <Text color="dimmed" size="sm">
                  4:00 PM - 5:00 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Friday</Text>
                <Text color="dimmed" size="sm">
                  1:00 PM - 2:00 PM
                </Text>
                <Text color="dimmed" size="sm">
                  6:00 PM - 7:00 PM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Saturday</Text>
                <Text color="dimmed" size="sm">
                  10:00 AM - 11:00 AM
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Sunday</Text>
                <Text color="dimmed" size="sm">
                  No sessions
                </Text>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default withAuth(DashboardPage, false);
