"use client";

import {
  AppShell,
  Burger,
  NavLink,
  Title,
  Button,
  Avatar,
  Group,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconUsers,
  IconCalendar,
  IconMessageCircle,
} from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Navbar
        p="md"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1A1B1E", // Cor de fundo ajustada
          color: "#FFFFFF", // Cor do texto ajustada
        }}
      >
        <div>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1} mb="lg" style={{ color: "#FFFFFF" }}>
            <NavLink
              label="Fituno"
              href="/dashboard"
              style={{ color: "#FFFFFF" }}
            />
          </Title>
          <NavLink
            href="/dashboard"
            label="Dashboard"
            leftSection={<IconDashboard size={16} />}
            style={{ color: "#FFFFFF" }}
          />
          <NavLink
            href="/dashboard/clients"
            label="Clientes"
            leftSection={<IconUsers size={16} />}
            style={{ color: "#FFFFFF" }}
          />
          <NavLink
            href="/dashboard/attendances"
            label="Atendimentos"
            leftSection={<IconCalendar size={16} />}
            style={{ color: "#FFFFFF" }}
          />
          <NavLink
            href="/dashboard/messages"
            label="Planos de treino"
            leftSection={<IconMessageCircle size={16} />}
            style={{ color: "#FFFFFF" }}
          />
        </div>
        <Stack>
          <Group>
            <Avatar radius="xl" c="blue">
              J
            </Avatar>
            <Button
              variant="subtle"
              c="dark"
              onClick={() => (window.location.href = "/profile")}
              style={{ color: "#FFFFFF" }}
            >
              John Doe
            </Button>
          </Group>
          <Button
            variant="subtle"
            c="red"
            onClick={() => console.log("Logout")}
            style={{ color: "#FFFFFF" }}
          >
            Logout
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: "#f8f9fa" }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
