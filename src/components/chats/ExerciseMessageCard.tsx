"use client";

import React from "react";
import { Card, Text, Box, useMantineTheme } from "@mantine/core";
import { Player } from "@lottiefiles/react-lottie-player";
import { Message } from "../../types/chat"; // Relative path
import { useFormatter } from "next-intl";

interface ExerciseMessageCardProps {
  message: Message;
  format: ReturnType<typeof useFormatter>;
}

const ExerciseMessageCard: React.FC<ExerciseMessageCardProps> = ({
  message,
  format,
}) => {
  const theme = useMantineTheme();

  // Ensure exerciseRef exists before rendering
  if (!message.exerciseRef) {
    // Optionally render the text part or null
    console.warn("ExerciseMessageCard rendered without exerciseRef:", message);
    return null; // Or render a fallback using message.text
  }

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      mt="xs"
      bg={theme.colors.gray[0]}
    >
      <Text size="sm" c="dimmed" mb={4}>
        {message.text} {/* Display context text */}
      </Text>
      <Text fw={500} size="sm">
        {message.exerciseRef.name}
      </Text>
      {message.exerciseRef.details && (
        <Text size="xs" c="dimmed">
          {message.exerciseRef.details}
        </Text>
      )}
      {message.exerciseRef.lottiePath && (
        <Box mt="xs">
          <Player
            autoplay
            loop
            src={message.exerciseRef.lottiePath}
            style={{
              height: "150px",
              width: "150px",
            }}
          />
        </Box>
      )}
      <Text size="xs" c={theme.colors.gray[6]} mt={4} ta="right">
        {format.dateTime(message.timestamp, {
          timeStyle: "short",
        })}
      </Text>
    </Card>
  );
};

export default ExerciseMessageCard;
