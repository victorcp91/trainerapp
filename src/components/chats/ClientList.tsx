"use client";

import React from "react";
import {
  List,
  ListItem,
  Badge,
  Avatar,
  Stack,
  Text,
  Group,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { Client } from "../../types/chat"; // Use relative path
import { useTranslations, useFormatter } from "next-intl"; // Import from next-intl

interface ClientListProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  t: ReturnType<typeof useTranslations<"ChatPage">>; // Use ReturnType for hook type
  format: ReturnType<typeof useFormatter>; // Use ReturnType for hook type
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  t,
  format,
}) => {
  const theme = useMantineTheme();

  return (
    <ScrollArea style={{ height: "100%" }} type="auto">
      <List spacing="sm" listStyleType="none" p="sm">
        {clients.map((client) => (
          <ListItem
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderRadius: theme.radius.sm,
              backgroundColor:
                client.id === selectedClientId
                  ? theme.colors.blue[0]
                  : "transparent",
              borderBottom: `1px solid ${theme.colors.gray[2]}`, // Separator
              "&:hover": {
                // Add hover effect
                backgroundColor:
                  client.id !== selectedClientId
                    ? theme.colors.gray[1]
                    : theme.colors.blue[0],
              },
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group wrap="nowrap">
                <Avatar
                  src={client.avatarUrl}
                  alt={client.name}
                  radius="xl"
                  size="md"
                />
                <Stack gap={0}>
                  {/* Use Stack for vertical layout */}
                  <Text
                    size="sm"
                    fw={client.hasNewMessages ? 700 : 400}
                    truncate
                  >
                    {client.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {/* Display last message time */}
                    {t("lastMessagePrefix")}
                    {(() => {
                      const lastMsgDate = new Date(client.lastMessageTime);
                      const today = new Date();
                      const isToday =
                        lastMsgDate.toDateString() === today.toDateString();
                      const yesterday = new Date(today); // Add yesterday check
                      yesterday.setDate(today.getDate() - 1);
                      const isYesterday =
                        lastMsgDate.toDateString() === yesterday.toDateString();

                      if (isToday) {
                        // Use format.dateTime for time
                        return format.dateTime(lastMsgDate, {
                          timeStyle: "short",
                        });
                      } else if (isYesterday) {
                        // Display "Yesterday"
                        return t("yesterday");
                      } else {
                        // Use format.dateTime for short date
                        return format.dateTime(lastMsgDate, {
                          month: "short",
                          day: "numeric",
                        });
                      }
                    })()}
                  </Text>
                </Stack>
              </Group>
              {client.hasNewMessages && client.newMessageCount && (
                <Badge color="red" variant="filled" size="sm" circle>
                  {client.newMessageCount}
                </Badge>
              )}
            </Group>
          </ListItem>
        ))}
      </List>
    </ScrollArea>
  );
};

export default ClientList;
