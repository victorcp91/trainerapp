import React from "react";
import {
  Card,
  Flex,
  Group,
  Avatar,
  Text,
  Badge,
  Grid,
  Button,
  ActionIcon,
} from "@mantine/core";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useFormatter } from "next-intl";
import { Client } from "@/types/client"; // Import the shared type

// Helper function (consider moving to utils if used elsewhere)
const calculateAge = (birthDateString?: string): number | null => {
  if (!birthDateString) return null;
  try {
    // Assuming startDate is actually birthDate based on how it's used for age calculation
    // If it's truly startDate, the age calculation might be incorrect. Please clarify.
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    console.error(
      "Error parsing date for age calculation:",
      birthDateString,
      e
    );
    return null;
  }
};

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onSchedule: (client: Client) => void;
  t: (key: string) => string; // Simplified translation function type
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onSchedule,
  t,
}) => {
  const r = useRouter();
  const format = useFormatter();
  const clientAge = calculateAge(client.startDate); // Using startDate for age, confirm if correct

  return (
    <Card withBorder shadow="sm" p="lg" radius="md" style={{ height: "100%" }}>
      <Flex direction="column" h="100%">
        <Flex justify="space-between" align="center" mb="md">
          <Group
            onClick={() => r.push(`/dashboard/clients/${client.id}`)}
            style={{ cursor: "pointer" }}
          >
            <Avatar
              src={client.profilePicture || undefined}
              alt={client.name}
              radius="xl"
            />
            <Text fw={500}>{client.name}</Text>
          </Group>
          <Badge
            variant="light"
            color={client.status === "active" ? "green" : "gray"}
          >
            {t(
              client.status === "active"
                ? "filterStatusActive"
                : "filterStatusInactive"
            )}
          </Badge>
        </Flex>

        <Grid gutter="xs" mb="md">
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed">
              {t("clientCard.type")}
            </Text>
            <Text size="sm">{t(`clientTypes.${client.type}`)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed">
              {t("clientCard.plan")}
            </Text>
            <Badge
              variant="light"
              color={
                client.planStatus === "overdue"
                  ? "red"
                  : client.planStatus === "near_due"
                  ? "orange"
                  : "blue"
              }
            >
              {t(`planStatuses.${client.planStatus}`)}
            </Badge>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed">
              {t("clientCard.age")}
            </Text>
            <Text size="sm">
              {clientAge ? `${clientAge} ${t("clientCard.years")}` : "N/A"}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed">
              {t("clientCard.gender")}
            </Text>
            <Text size="sm">{t(`genders.${client.gender}`)}</Text>
          </Grid.Col>
          {client.startDate && (
            <Grid.Col span={12}>
              <Text size="xs" c="dimmed">
                {/* Assuming this should be Start Date, not Birth Date for the label */}
                {t("clientCard.startDate")}
              </Text>
              <Text size="sm">
                {format.dateTime(new Date(client.startDate), {
                  dateStyle: "medium",
                })}
              </Text>
            </Grid.Col>
          )}
        </Grid>

        <Flex mt="auto" gap="xs" wrap="wrap">
          <Button variant="light" size="xs" onClick={() => onEdit(client)}>
            {t("clientCard.editButton")}
          </Button>
          <Button
            variant="light"
            color="green"
            size="xs"
            onClick={() => onSchedule(client)}
          >
            {t("clientCard.scheduleButton")}
          </Button>
          <Button
            variant="light"
            color="cyan"
            size="xs"
            onClick={() => r.push(`/dashboard/clients/${client.id}/new-plan`)}
          >
            {t("clientCard.planButton")}
          </Button>
          <Button
            variant="light"
            color="orange"
            size="xs"
            onClick={() => console.log("Anamnesis for", client.id)} // Placeholder for actual anamnesis logic
          >
            {t("clientCard.anamnesisButton")}
          </Button>
          {client.phone && (
            <ActionIcon
              variant="light"
              color="teal"
              size="sm" // Consistent size with buttons might be 'xs' or keep 'sm'
              component="a"
              href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${client.name}`} // Accessibility
            >
              <IconBrandWhatsapp size={16} />
            </ActionIcon>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default ClientCard;
