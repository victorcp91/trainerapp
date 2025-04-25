import React from "react";
import { Group, Avatar, Stack, Text, Badge, Switch } from "@mantine/core";

interface ClientProfileHeaderProps {
  clientName: string;
  clientType: string; // e.g., 'Híbrido', 'Online', 'Presencial'
  clientTypeColor: string; // e.g., 'blue', 'green', 'orange'
  isActive: boolean;
  onActiveChange: (isActive: boolean) => void;
  // Add avatarSrc prop if the avatar should be dynamic
  // avatarSrc?: string;
}

const ClientProfileHeader: React.FC<ClientProfileHeaderProps> = ({
  clientName,
  clientType,
  clientTypeColor,
  isActive,
  onActiveChange,
}) => {
  return (
    <Group>
      <Avatar radius="xl" size="lg" /> {/* Add src={avatarSrc} if needed */}
      <Stack>
        <Group>
          <Text size="lg">{clientName}</Text>
          <Badge color={clientTypeColor}>{clientType}</Badge>
        </Group>
        <Switch
          checked={isActive}
          onChange={(event) => onActiveChange(event.currentTarget.checked)}
          label={isActive ? "Ativo" : "Inativo"}
          size="sm"
        />
      </Stack>
    </Group>
  );
};

export default ClientProfileHeader;
