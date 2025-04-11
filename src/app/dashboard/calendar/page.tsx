import React from "react";
import { Button, Card, Group, Text, Title, Badge } from "@mantine/core";
import { Calendar } from "@mantine/dates";

const CalendarPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Group mb="lg">
        <Title order={1}>Calendar</Title>
        <Button variant="filled" color="blue">
          + New Appointment
        </Button>
      </Group>

      <Group align="flex-start">
        {/* Sidebar com o calendário */}
        <Card shadow="sm" padding="lg" style={{ width: "300px" }}>
          <Calendar />
        </Card>

        {/* Detalhes do dia selecionado */}
        <Card shadow="sm" padding="lg" style={{ width: "250px", flex: 1 }}>
          <Group mb="md">
            <Title order={2}>Thursday, April 10, 2025</Title>
            <Badge color="gray" variant="light">
              No appointments
            </Badge>
          </Group>
          <Card withBorder padding="lg" style={{ textAlign: "center" }}>
            <Text size="lg" mb="sm">
              No appointments scheduled
            </Text>
            <Text color="dimmed" size="sm" mb="lg">
              There are no appointments scheduled for this day.
            </Text>
            <Button variant="outline" color="blue">
              + Schedule Session
            </Button>
          </Card>
        </Card>
      </Group>
    </div>
  );
};

export default CalendarPage;
