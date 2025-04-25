"use client";

import React from "react";
import { Paper, Text, Avatar, Group, useMantineTheme } from "@mantine/core";
import { Client } from "../../types/chat";

interface ChatHeaderProps {
  client: Client | undefined;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ client }) => {
  const theme = useMantineTheme();

  if (!client) {
    return null; // Or some placeholder/loading state if needed
  }

  return (
    <Paper
      p="sm"
      shadow="xs"
      withBorder
      style={{
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
      }}
    >
      <Group>
        <Avatar src={client.avatarUrl} alt={client.name} radius="xl" />
        <Text fw={500}>{client.name}</Text>
      </Group>
    </Paper>
  );
};

export default ChatHeader;
