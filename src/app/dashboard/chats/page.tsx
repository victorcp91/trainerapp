"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  List,
  ListItem,
  Badge,
  Paper,
  Text,
  Avatar,
  Stack,
  ScrollArea,
  TextInput,
  ActionIcon,
  Group,
  Box,
  useMantineTheme,
  Title,
  Container,
  Divider,
  Card,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react"; // Assuming you use tabler icons
import { Player } from "@lottiefiles/react-lottie-player"; // <-- Import Lottie Player
import { useTranslations, useFormatter } from "next-intl"; // <-- Import useTranslations and useFormatter

// --- Placeholder Data ---
// In a real app, this would come from an API
interface Client {
  id: string;
  name: string;
  avatarUrl?: string; // Optional avatar
  hasNewMessages: boolean;
  newMessageCount?: number;
  lastMessageTime: Date; // For sorting
  messages: Message[]; // Simple message store for demo
}

// --- Define ExerciseReference structure ---
interface ExerciseReference {
  id: string; // Unique ID for the exercise
  name: string; // Name of the exercise
  // Optional: Add more details if needed later
  details?: string; // e.g., "3 sets x 10 reps"
  imageUrl?: string; // Optional image/thumbnail
  lottiePath?: string; // <-- Add path to lottie file
}

// Update the Message interface
interface Message {
  id: string;
  sender: "user" | "client";
  text: string; // Keep text for context or fallback
  timestamp: Date;
  exerciseRef?: ExerciseReference; // Add the optional exercise reference
}

const placeholderClients: Client[] = [
  {
    id: "client-1",
    name: "Alice Wonderland",
    hasNewMessages: true,
    newMessageCount: 2,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    messages: [
      {
        id: "m0",
        sender: "client",
        text: "Hey, how did the session go yesterday?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago (yesterday)
      },
      {
        id: "m1",
        sender: "user",
        text: "It went well! Ready for today's?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago (yesterday)
      },
      {
        id: "m2",
        sender: "client",
        text: "Hi there!", // Changed from "Hello Alice!" for flow
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago (today)
      },
      {
        id: "m3",
        sender: "client",
        text: "Can we reschedule?",
        timestamp: new Date(Date.now() - 1000 * 60 * 6), // 6 mins ago (today)
      },
      {
        id: "m4",
        sender: "client",
        text: "Tomorrow maybe?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago (today)
      },
      {
        id: "m4-exercise",
        sender: "client",
        text: "Also, quick question about this exercise:",
        timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 mins ago (today)
        exerciseRef: {
          id: "ex-squat-1",
          name: "Barbell Back Squat",
          details: "3 sets x 8-10 reps",
          lottiePath: "/images/lottie/example_exercise.json", // <-- Add Lottie path
        },
      },
    ],
  },
  {
    id: "client-2",
    name: "Bob The Builder",
    hasNewMessages: false,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messages: [
      {
        id: "m5",
        sender: "user",
        text: "How was the session?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
      {
        id: "m6",
        sender: "client",
        text: "It was great, thanks!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ],
  },
  {
    id: "client-3",
    name: "Charlie Chaplin",
    hasNewMessages: true,
    newMessageCount: 1,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 1), // 1 min ago
    messages: [
      {
        id: "m7",
        sender: "client",
        text: "Running 5 mins late!",
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
      },
    ],
  },
  {
    id: "client-4",
    name: "Diana Prince",
    hasNewMessages: false,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messages: [
      {
        id: "m8",
        sender: "user",
        text: "See you next week!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      },
      {
        id: "m9",
        sender: "client",
        text: "Sounds good!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    ],
  },
];

// --- Helper Functions ---
const sortClients = (clients: Client[]): Client[] => {
  return [...clients].sort((a, b) => {
    // Prioritize clients with new messages
    if (a.hasNewMessages && !b.hasNewMessages) return -1;
    if (!a.hasNewMessages && b.hasNewMessages) return 1;
    // If both have or don't have new messages, sort by most recent message time
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });
};

// --- ChatPage Component ---
const ChatPage = () => {
  const theme = useMantineTheme();
  const t = useTranslations("ChatPage"); // <-- Initialize translations
  const format = useFormatter(); // <-- Initialize formatter
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState(""); // For input field
  const viewport = useRef<HTMLDivElement>(null); // Ref for scroll area viewport

  // Initial load and sort clients
  useEffect(() => {
    // Simulate fetching data
    const sorted = sortClients(placeholderClients);
    setClients(sorted);
    // Select the first client by default
    if (sorted.length > 0) {
      setSelectedClientId(sorted[0].id);
    }
  }, []);

  // Update messages when selected client changes
  useEffect(() => {
    if (selectedClientId) {
      const selectedClient = clients.find((c) => c.id === selectedClientId);
      setCurrentMessages(selectedClient?.messages || []);
      // TODO: Mark messages as read when chat is opened
      // This would involve updating the client state (e.g., set hasNewMessages to false)
      // and potentially making an API call.
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === selectedClientId
            ? { ...c, hasNewMessages: false, newMessageCount: 0 }
            : c
        )
      );
    } else {
      setCurrentMessages([]);
    }
  }, [selectedClientId]); // Rerun ONLY when selectedClientId changes

  // Scroll to bottom when messages change
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentMessages]); // Rerun whenever messages update

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClientId) return;

    const messageToSend: Message = {
      id: `msg-${Date.now()}`, // simple unique id
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    // Update messages for the selected client
    setCurrentMessages((prev) => [...prev, messageToSend]);

    // Update the client's message list in the main state
    setClients((prevClients) =>
      prevClients.map((c) =>
        c.id === selectedClientId
          ? {
              ...c,
              messages: [...c.messages, messageToSend],
              lastMessageTime: messageToSend.timestamp, // Update last message time
            }
          : c
      )
    );

    // Resort clients potentially, though might be better to do less frequently
    setClients((prevClients) => sortClients(prevClients));

    setNewMessage("");
    // TODO: Send message via API
    console.log("Sending message:", messageToSend);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <Container size="xl" py="xl">
      <Stack gap="md" flex={1}>
        <Title order={2} mb="md">
          {t("title")}
        </Title>
        <Divider my="md" />
        {/* Wrap Grid in a Card for consistent styling */}
        <Card
          shadow="sm"
          p="lg"
          style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}
        >
          <Grid
            gutter="md"
            style={{ flexGrow: 1, overflow: "hidden" }} // Ensure Grid fills the Card
          >
            {/* Left Column: Chat View */}
            <Grid.Col
              span={8}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "70vh",
              }}
            >
              {selectedClient ? (
                <>
                  {/* Chat Header */}
                  <Paper
                    p="sm"
                    shadow="xs"
                    withBorder
                    style={{
                      borderBottom: `1px solid ${theme.colors.gray[3]}`,
                    }}
                  >
                    <Group>
                      <Avatar
                        src={selectedClient.avatarUrl}
                        alt={selectedClient.name}
                        radius="xl"
                      />
                      <Text fw={500}>{selectedClient.name}</Text>
                    </Group>
                  </Paper>

                  {/* Message List */}
                  <ScrollArea
                    viewportRef={viewport}
                    style={{ flexGrow: 1 }}
                    p="md"
                    type="auto"
                  >
                    <Stack gap="md">
                      {(() => {
                        let lastDate: string | null = null;
                        return currentMessages.map((msg) => {
                          const currentDate = msg.timestamp.toDateString();
                          const showDateSeparator = currentDate !== lastDate;
                          lastDate = currentDate; // Update lastDate for the next iteration

                          const messageDate = new Date(msg.timestamp);
                          const today = new Date();
                          const isToday =
                            messageDate.toDateString() === today.toDateString();
                          const yesterday = new Date(today);
                          yesterday.setDate(today.getDate() - 1);
                          const isYesterday =
                            messageDate.toDateString() ===
                            yesterday.toDateString();

                          let displayDate: string | React.ReactNode =
                            format.dateTime(messageDate, { dateStyle: "full" });

                          if (isToday) {
                            displayDate = <Text fw={500}>{t("today")}</Text>;
                          } else if (isYesterday) {
                            displayDate = (
                              <Text fw={500}>{t("yesterday")}</Text>
                            );
                          }

                          return (
                            <React.Fragment key={msg.id}>
                              {showDateSeparator && (
                                <Divider
                                  label={displayDate}
                                  labelPosition="center"
                                  my="md"
                                />
                              )}
                              <Box
                                style={{
                                  alignSelf:
                                    msg.sender === "user"
                                      ? "flex-end"
                                      : "flex-start",
                                  maxWidth: "75%", // Prevent messages from getting too wide
                                }}
                              >
                                {msg.exerciseRef ? (
                                  // --- Render Exercise Reference ---
                                  <Card
                                    shadow="sm"
                                    padding="sm"
                                    radius="md"
                                    withBorder
                                    mt="xs" // Add some margin top
                                    bg={theme.colors.gray[0]} // Different background for exercise
                                  >
                                    <Text size="sm" c="dimmed" mb={4}>
                                      {msg.text} {/* Display context text */}
                                    </Text>
                                    <Text fw={500} size="sm">
                                      {msg.exerciseRef.name}
                                    </Text>
                                    {msg.exerciseRef.details && (
                                      <Text size="xs" c="dimmed">
                                        {msg.exerciseRef.details}
                                      </Text>
                                    )}
                                    {msg.exerciseRef.lottiePath && (
                                      <Box mt="xs">
                                        <Player
                                          autoplay
                                          loop
                                          src={msg.exerciseRef.lottiePath}
                                          style={{
                                            height: "150px",
                                            width: "150px",
                                          }} // Adjust size as needed
                                        />
                                      </Box>
                                    )}
                                    <Text
                                      size="xs"
                                      c={theme.colors.gray[6]}
                                      mt={4}
                                      ta="right"
                                    >
                                      {/* Use format.dateTime for time */}
                                      {format.dateTime(msg.timestamp, {
                                        timeStyle: "short",
                                      })}
                                    </Text>
                                  </Card>
                                ) : (
                                  // --- Render Regular Text Message ---
                                  <Paper
                                    withBorder
                                    shadow="sm"
                                    p="sm"
                                    radius="lg"
                                    bg={
                                      msg.sender === "user"
                                        ? theme.colors.blue[6]
                                        : theme.colors.gray[2]
                                    }
                                    c={
                                      msg.sender === "user"
                                        ? theme.white
                                        : theme.black
                                    }
                                  >
                                    <Text size="sm">{msg.text}</Text>
                                    <Text
                                      size="xs"
                                      c={
                                        msg.sender === "user"
                                          ? theme.colors.blue[1]
                                          : theme.colors.gray[6]
                                      }
                                      mt={4}
                                      ta="right"
                                    >
                                      {/* Use format.dateTime for time */}
                                      {format.dateTime(msg.timestamp, {
                                        timeStyle: "short",
                                      })}
                                    </Text>
                                  </Paper>
                                )}
                              </Box>
                            </React.Fragment>
                          );
                        });
                      })()}
                    </Stack>
                  </ScrollArea>

                  {/* Message Input */}
                  <Paper
                    p="sm"
                    withBorder
                    style={{ borderTop: `1px solid ${theme.colors.gray[3]}` }}
                  >
                    <Group gap="xs">
                      <TextInput
                        placeholder={t("messageInputPlaceholder")}
                        value={newMessage}
                        onChange={(event) =>
                          setNewMessage(event.currentTarget.value)
                        }
                        style={{ flexGrow: 1 }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault(); // Prevent newline on Enter
                            handleSendMessage();
                          }
                        }}
                      />
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        size="lg"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <IconSend size={18} />
                      </ActionIcon>
                    </Group>
                  </Paper>
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
            </Grid.Col>

            {/* Right Column: Client List */}
            <Grid.Col
              span={4}
              style={{
                borderLeft: `1px solid ${theme.colors.gray[3]}`,
                height: "100%",
              }}
            >
              <ScrollArea style={{ height: "100%" }} type="auto">
                <List spacing="sm" listStyleType="none" p="sm">
                  {clients.map((client) => (
                    <ListItem
                      key={client.id}
                      onClick={() => handleSelectClient(client.id)}
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
                            {" "}
                            {/* Use Stack for vertical layout */}
                            <Text
                              size="sm"
                              fw={client.hasNewMessages ? 700 : 400}
                              truncate
                            >
                              {client.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {" "}
                              {/* Display last message time */}
                              {t("lastMessagePrefix")}
                              {(() => {
                                const lastMsgDate = new Date(
                                  client.lastMessageTime
                                );
                                const today = new Date();
                                const isToday =
                                  lastMsgDate.toDateString() ===
                                  today.toDateString();
                                const yesterday = new Date(today); // Add yesterday check
                                yesterday.setDate(today.getDate() - 1);
                                const isYesterday =
                                  lastMsgDate.toDateString() ===
                                  yesterday.toDateString();

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
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
};

export default ChatPage;
