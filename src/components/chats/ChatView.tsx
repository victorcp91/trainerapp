"use client";

import React from "react";
import {
  Paper,
  Text,
  // Avatar,
  // Stack,
  // ScrollArea,
  // TextInput,
  // ActionIcon,
  // Group,
  // Box,
  // useMantineTheme,
  // Divider,
  // Card,
} from "@mantine/core";
import { Client, Message } from "../../types/chat";
import { useTranslations, useFormatter } from "next-intl";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatViewProps {
  selectedClient: Client | undefined;
  currentMessages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  t: ReturnType<typeof useTranslations<"ChatPage">>;
  format: ReturnType<typeof useFormatter>;
}

const ChatView: React.FC<ChatViewProps> = ({
  selectedClient,
  currentMessages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  viewportRef,
  t,
  format,
}) => {
  return (
    <>
      {selectedClient ? (
        <>
          <ChatHeader client={selectedClient} />
          <MessageList
            messages={currentMessages}
            viewportRef={viewportRef}
            t={t}
            format={format}
          />
          <MessageInput
            value={newMessage}
            onChange={onNewMessageChange}
            onSendMessage={onSendMessage}
            t={t}
          />
        </>
      ) : (
        <Paper
          p="xl"
          style={{
            textAlign: "center",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text c="dimmed">{t("selectClientPrompt")}</Text>
        </Paper>
      )}
    </>
  );
};

export default ChatView;
