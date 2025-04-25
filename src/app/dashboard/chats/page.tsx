"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Stack,
  useMantineTheme,
  Title,
  Container,
  Divider,
  Card,
} from "@mantine/core";
import { useTranslations, useFormatter } from "next-intl";
import { Client, Message } from "@/types/chat";
import ClientList from "@/components/chats/ClientList";
import ChatView from "@/components/chats/ChatView";

// --- Placeholder Data ---
const placeholderClients: Client[] = [
  {
    id: "client-1",
    name: "Alice Wonderland",
    avatarUrl: undefined,
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
          lottiePath: "/images/lottie/example_exercise.json",
        },
      },
    ],
  },
  {
    id: "client-2",
    name: "Bob The Builder",
    avatarUrl: undefined,
    hasNewMessages: false,
    newMessageCount: 0,
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
    avatarUrl: undefined,
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
    avatarUrl: undefined,
    hasNewMessages: false,
    newMessageCount: 0,
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
    if (a.hasNewMessages && !b.hasNewMessages) return -1;
    if (!a.hasNewMessages && b.hasNewMessages) return 1;
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });
};

// --- ChatPage Component ---
const ChatPage = () => {
  const theme = useMantineTheme();
  const t = useTranslations("ChatPage");
  const format = useFormatter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const viewport = useRef<HTMLDivElement>(null);

  // Initial load and sort clients
  useEffect(() => {
    const sorted = sortClients(placeholderClients);
    setClients(sorted);
    if (sorted.length > 0) {
      setSelectedClientId(sorted[0].id);
    }
  }, []);

  // Effect 1: Update currentMessages whenever the selected client OR the messages themselves change
  useEffect(() => {
    if (selectedClientId) {
      const selectedClient = clients.find((c) => c.id === selectedClientId);
      setCurrentMessages(selectedClient?.messages || []);
    } else {
      setCurrentMessages([]);
    }
  }, [selectedClientId, clients]); // Depend on both ID and the full client list

  // Effect 2: Mark messages as read ONLY when the selected client ID changes
  useEffect(() => {
    if (selectedClientId) {
      setClients((prevClients) => {
        // Check if the currently selected client in the previous state actually needs updating
        const clientNeedsUpdate = prevClients.some(
          (c) =>
            c.id === selectedClientId &&
            (c.hasNewMessages || (c.newMessageCount && c.newMessageCount > 0))
        );

        // Only map and return a new array if an update is necessary
        if (clientNeedsUpdate) {
          return prevClients.map((c) =>
            c.id === selectedClientId
              ? { ...c, hasNewMessages: false, newMessageCount: 0 }
              : c
          );
        }
        // Otherwise, return the same array instance to prevent unnecessary re-renders
        return prevClients;
      });
    }
    // This effect ONLY runs when the selected client ID changes.
  }, [selectedClientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentMessages]);

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedClientId) return;

    const messageToSend: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    // Update client's message list and last message time locally
    const updatedClients = clients.map((c) =>
      c.id === selectedClientId
        ? {
            ...c,
            messages: [...c.messages, messageToSend],
            lastMessageTime: messageToSend.timestamp,
          }
        : c
    );

    // Update state with sorted clients
    setClients(sortClients(updatedClients));

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
        <Card
          shadow="sm"
          p="lg"
          style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}
        >
          <Grid gutter="md" style={{ flexGrow: 1, overflow: "hidden" }}>
            {/* Left Column: Chat View Component */}
            <Grid.Col
              span={8}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "70vh", // Maintain height constraint
              }}
            >
              <ChatView
                selectedClient={selectedClient}
                currentMessages={currentMessages}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage} // Pass setter directly
                onSendMessage={handleSendMessage}
                viewportRef={viewport}
                t={t}
                format={format}
              />
            </Grid.Col>

            {/* Right Column: Client List Component */}
            <Grid.Col
              span={4}
              style={{
                borderLeft: `1px solid ${theme.colors.gray[3]}`, // Use theme color
                height: "100%", // Let ClientList manage its scroll
              }}
            >
              <ClientList
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={handleSelectClient}
                t={t}
                format={format}
              />
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
};

export default ChatPage;
