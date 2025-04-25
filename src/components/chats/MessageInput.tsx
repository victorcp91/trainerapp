"use client";

import React from "react";
import {
  Paper,
  TextInput,
  ActionIcon,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  t: ReturnType<typeof useTranslations<"ChatPage">>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSendMessage,
  t,
}) => {
  const theme = useMantineTheme();

  return (
    <Paper
      p="sm"
      withBorder
      style={{ borderTop: `1px solid ${theme.colors.gray[3]}` }}
    >
      <Group gap="xs">
        <TextInput
          placeholder={t("messageInputPlaceholder")}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          style={{ flexGrow: 1 }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault(); // Prevent newline on Enter
              onSendMessage();
            }
          }}
        />
        <ActionIcon
          variant="filled"
          color="blue"
          size="lg"
          onClick={onSendMessage}
          disabled={!value.trim()}
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default MessageInput;
