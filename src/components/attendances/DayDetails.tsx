import React from "react";
import { Card, Group, Title, Text, Tooltip, Button } from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconCalendar,
} from "@tabler/icons-react";
import AppointmentListItem from "./AppointmentListItem";
import { Appointment } from "@/types/attendances";
import { useAttendance } from "@/contexts/AttendanceContext";

interface DayDetailsProps {
  appointments: Appointment[];
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  missedAppointments: number;
  onEditAppointment: (appointment: Appointment) => void;
  onOpenReasonModal: (type: "cancel" | "absence", id: number) => void;
  onCheckIn: (id: number) => void;
  onOpenScheduleModal: () => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({
  appointments,
  totalAppointments,
  completedAppointments,
  canceledAppointments,
  missedAppointments,
  onEditAppointment,
  onOpenReasonModal,
  onCheckIn,
  onOpenScheduleModal,
}) => {
  const { selectedDate } = useAttendance();

  return (
    <Card withBorder shadow="sm" px="lg" py="xs" style={{ flex: 1 }}>
      <Group
        mb="md"
        style={{ justifyContent: "space-between", flexWrap: "wrap" }}
      >
        <Title order={3} style={{ flexBasis: "100%", marginBottom: "10px" }}>
          {selectedDate
            ? selectedDate.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Nenhuma data selecionada"}
        </Title>
        <Group style={{ alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
          <Tooltip label="Total de agendamentos" withArrow>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconCalendar size={20} color="blue" />
              <Text size="sm">{totalAppointments}</Text>
            </div>
          </Tooltip>
          <Tooltip label="Total de concluídos" withArrow>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconCheck size={20} color="green" />
              <Text size="sm">{completedAppointments}</Text>
            </div>
          </Tooltip>
          <Tooltip label="Total de cancelados" withArrow>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconX size={20} color="red" />
              <Text size="sm">{canceledAppointments}</Text>
            </div>
          </Tooltip>
          <Tooltip label="Total de faltas" withArrow>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconAlertCircle size={20} color="yellow" />
              <Text size="sm">{missedAppointments}</Text>
            </div>
          </Tooltip>
        </Group>
      </Group>
      <Card style={{ textAlign: "center", padding: 0 }}>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentListItem
              key={appointment.id}
              appointment={appointment}
              onEdit={onEditAppointment}
              onCheckIn={onCheckIn}
              onMarkAbsence={(id) => onOpenReasonModal("absence", id)}
              onCancel={(id) => onOpenReasonModal("cancel", id)}
            />
          ))
        ) : (
          <Text color="dimmed" mt="md" mb="md">
            Nenhum atendimento agendado para esta data.
          </Text>
        )}
        <Button
          variant="outline"
          c="blue"
          onClick={onOpenScheduleModal}
          mt="md"
          fullWidth
        >
          + Agendar atendimento
        </Button>
      </Card>
    </Card>
  );
};

export default DayDetails;
