import React from "react";
import { Card, Group, Text, Avatar, Tooltip, Button } from "@mantine/core";
import { IconMapPin, IconEdit } from "@tabler/icons-react";
import { Appointment } from "@/types/attendances"; // Assuming you have a type definition
import { useTranslations } from "next-intl";

interface AppointmentListItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onCheckIn: (id: number) => void;
  onMarkAbsence: (id: number) => void;
  onCancel: (id: number) => void;
}

const AppointmentListItem: React.FC<AppointmentListItemProps> = ({
  appointment,
  onEdit,
  onCheckIn,
  onMarkAbsence,
  onCancel,
}) => {
  const t = useTranslations();
  return (
    <Card
      key={appointment.id}
      withBorder
      shadow="sm"
      padding="md"
      mb="sm"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <Group
        style={{
          flexDirection: "row",
          gap: "5px",
          alignItems: "flex-start",
          flex: 1,
          marginTop: "-10px",
        }}
      >
        <Group
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "5px",
            marginTop: "5px",
            flex: 1,
          }}
        >
          <Group>
            <Text
              size="sm"
              color="dimmed"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {new Date(appointment.startTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(appointment.endTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Group>
          <Group style={{ flex: 1, alignItems: "center" }}>
            <Avatar
              src={appointment.avatar}
              alt={`Avatar de ${appointment.client}`}
              radius="xl"
              size={40}
            />
            <Text fw={500}>{appointment.client}</Text>
          </Group>
          <Group style={{ flex: 1, width: "100%" }}>
            <Text
              size="sm"
              color="dimmed"
              style={{
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <IconMapPin size={16} color="blue" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  appointment.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {appointment.address}
              </a>
            </Text>
          </Group>
          <Group mt="xs">
            <Button
              size="xs"
              variant="light"
              color="green"
              onClick={() => onCheckIn(appointment.id)}
            >
              {t("attendances.listItem.checkInButton")}
            </Button>
            <Button
              size="xs"
              variant="light"
              color="yellow"
              onClick={() => onMarkAbsence(appointment.id)}
            >
              {t("attendances.listItem.absenceButton")}
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => onCancel(appointment.id)}
            >
              {t("common.cancel")}
            </Button>
          </Group>
        </Group>
      </Group>
      <Tooltip label={t("attendances.listItem.editTooltip")} withArrow>
        <IconEdit
          size={20}
          color="blue"
          style={{
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
          onClick={() => onEdit(appointment)}
        />
      </Tooltip>
    </Card>
  );
};

export default AppointmentListItem;
