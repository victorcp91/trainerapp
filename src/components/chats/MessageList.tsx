"use client";

import React from "react";
import { Text, Stack, ScrollArea, Box, Divider } from "@mantine/core";
import { Message } from "../../types/chat";
import { useFormatter, useTranslations } from "next-intl";
import TextMessageCard from "./TextMessageCard";
import ExerciseMessageCard from "./ExerciseMessageCard";

interface MessageListProps {
  messages: Message[];
  viewportRef: React.RefObject<HTMLDivElement | null>;
  t: ReturnType<typeof useTranslations<"ChatPage">>;
  format: ReturnType<typeof useFormatter>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  viewportRef,
  t,
  format,
}) => {
  const renderMessagesWithSeparators = () => {
    let lastDate: string | null = null;
    return messages.map((msg) => {
      const currentDate = msg.timestamp.toDateString();
      const showDateSeparator = currentDate !== lastDate;
      lastDate = currentDate;

      const messageDate = new Date(msg.timestamp);
      const today = new Date();
      const isToday = messageDate.toDateString() === today.toDateString();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const isYesterday =
        messageDate.toDateString() === yesterday.toDateString();

      let displayDate: string | React.ReactNode = format.dateTime(messageDate, {
        dateStyle: "full",
      });

      if (isToday) {
        displayDate = <Text fw={500}>{t("today")}</Text>;
      } else if (isYesterday) {
        displayDate = <Text fw={500}>{t("yesterday")}</Text>;
      }

      return (
        <React.Fragment key={msg.id}>
          {showDateSeparator && (
            <Divider label={displayDate} labelPosition="center" my="md" />
          )}
          <Box
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "75%",
            }}
          >
            {msg.exerciseRef ? (
              <ExerciseMessageCard message={msg} format={format} />
            ) : (
              <TextMessageCard message={msg} format={format} />
            )}
          </Box>
        </React.Fragment>
      );
    });
  };

  return (
    <ScrollArea
      viewportRef={viewportRef}
      style={{ flexGrow: 1 }}
      p="md"
      type="auto"
    >
      <Stack gap="md">{renderMessagesWithSeparators()}</Stack>
    </ScrollArea>
  );
};

export default MessageList;
