"use client";

import React from "react";
import { Paper, Text, useMantineTheme } from "@mantine/core";
import { Message } from "../../types/chat";
import { useFormatter } from "next-intl";

interface TextMessageCardProps {
  message: Message;
  format: ReturnType<typeof useFormatter>;
}

const TextMessageCard: React.FC<TextMessageCardProps> = ({
  message,
  format,
}) => {
  const theme = useMantineTheme();

  return (
    <Paper
      withBorder
      shadow="sm"
      p="sm"
      radius="lg"
      bg={
        message.sender === "user" ? theme.colors.blue[6] : theme.colors.gray[2]
      }
      c={message.sender === "user" ? theme.white : theme.black}
    >
      <Text size="sm">{message.text}</Text>
      <Text
        size="xs"
        c={
          message.sender === "user"
            ? theme.colors.blue[1]
            : theme.colors.gray[6]
        }
        mt={4}
        ta="right"
      >
        {format.dateTime(message.timestamp, {
          timeStyle: "short",
        })}
      </Text>
    </Paper>
  );
};

export default TextMessageCard;
