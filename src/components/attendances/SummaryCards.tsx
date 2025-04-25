import React from "react";
import { Card, Group, Title } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { useAttendance } from "@/contexts/AttendanceContext"; // Import context hook

// Restore props interface for mock data
interface SummaryCardsProps {
  // selectedDate: Date | null; // Still comes from context
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  missedAppointments: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  // Accept props again
  totalAppointments,
  completedAppointments,
  canceledAppointments,
  missedAppointments,
}) => {
  // Get selectedDate from context for titles
  const { selectedDate } = useAttendance();

  // Calculate donut data based on passed props (mock stats)
  const calculateDonutData = () => {
    const total = totalAppointments || 1; // Avoid division by zero
    const pending =
      total -
      (completedAppointments + canceledAppointments + missedAppointments);
    return [
      { value: completedAppointments, color: "green", name: "Concluídos" },
      { name: "Cancelados", value: canceledAppointments, color: "yellow" },
      { name: "Faltas", value: missedAppointments, color: "red" },
      { name: "Pendentes", value: pending > 0 ? pending : 0, color: "gray" },
    ].filter((item) => item.value > 0);
  };

  // Use the same mock data for all periods for now
  const donutData = calculateDonutData();

  // Titles use selectedDate from context
  const yearTitle = selectedDate
    ? selectedDate.getFullYear().toString()
    : "Ano";
  const monthTitle = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", {
        month: "long",
        year:
          selectedDate.getFullYear() !== new Date().getFullYear()
            ? "numeric"
            : undefined,
      })
    : "Mês";
  const dayTitle = "Hoje"; // Or selected day?

  return (
    <Group mb="lg" grow style={{ alignItems: "stretch" }}>
      {/* Card do ano */}
      <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
        <Group style={{ flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Title order={3}>{yearTitle}</Title>
          </div>
          <DonutChart
            style={{ marginTop: "-50px" }}
            data={donutData} // Use calculated mock data
            withLabels
            withLabelsLine
            labelsType="value"
            paddingAngle={5}
            size={100}
            thickness={14}
            tooltipDataSource="segment"
          />
        </Group>
      </Card>

      {/* Card do mês */}
      <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
        <Group style={{ flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Title order={3}>{monthTitle}</Title>
          </div>
          <DonutChart
            style={{ marginTop: "-50px" }}
            paddingAngle={5}
            size={100}
            thickness={14}
            data={donutData} // Use calculated mock data
            withLabels
            withLabelsLine
            labelsType="value"
            tooltipDataSource="segment"
          />
        </Group>
      </Card>

      {/* Card do dia */}
      <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
        <Group style={{ flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Title order={3}>{dayTitle}</Title>
          </div>
          <DonutChart
            style={{ marginTop: "-50px" }}
            paddingAngle={5}
            size={100}
            thickness={14}
            data={donutData} // Use calculated mock data
            withLabels
            withLabelsLine
            labelsType="value"
            tooltipDataSource="segment"
          />
        </Group>
      </Card>
    </Group>
  );
};

export default SummaryCards;
