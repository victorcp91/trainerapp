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
  IconBarbell,
  IconSettings,
  IconLogout,
  IconClipboardText,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();
  const t = useTranslations("Sidebar");

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
        p={24}
        pr={0}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "stretch",
          background: "linear-gradient(180deg, #181A1B 80%, #23272F 100%)",
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
          minHeight: "100vh",
        }}
      >
        <Stack gap={32} style={{ flex: 1 }}>
          <Group
            justify="space-between"
            align="center"
            mb={24}
            style={{ marginLeft: 2 }}
          >
            <Group gap={8} style={{ flexDirection: "column" }}>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Title
                order={2}
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: 1,
                  marginLeft: 4,
                  marginTop: 2,
                }}
              >
                FitUno
              </Title>
              <Group gap={12}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#1327e7",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#40c057",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#fab005",
                    border: "1px solid #b3a800",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ed1100",
                  }}
                />
              </Group>
            </Group>
          </Group>
          <Stack gap={8}>
            <NavLink
              href="/dashboard"
              label={t("dashboard")}
              leftSection={<IconDashboard size={20} />}
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 8,
                padding: 10,
                marginBottom: 2,
                transition: "background .2s, color .2s",
              }}
              active={false}
              className="sidebar-link"
            />
            <NavLink
              href="/dashboard/clients"
              label={t("clients")}
              leftSection={<IconUsers size={20} />}
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 8,
                padding: 10,
                marginBottom: 2,
                transition: "background .2s, color .2s",
              }}
              active={false}
              className="sidebar-link"
            />
            <NavLink
              href="/dashboard/attendances"
              label={t("attendances")}
              leftSection={<IconCalendar size={20} />}
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 8,
                padding: 10,
                marginBottom: 2,
                transition: "background .2s, color .2s",
              }}
              active={false}
              className="sidebar-link"
            />
            <NavLink
              href="/dashboard/training-models"
              label={t("trainingModels")}
              leftSection={<IconBarbell size={20} />}
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 8,
                padding: 10,
                marginBottom: 2,
                transition: "background .2s, color .2s",
              }}
              active={false}
              className="sidebar-link"
            />
            <NavLink
              href="/dashboard/anamnesis-models"
              label={t("anamnesisModels")}
              leftSection={<IconClipboardText size={20} />}
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 8,
                padding: 10,
                marginBottom: 2,
                transition: "background .2s, color .2s",
              }}
              active={false}
              className="sidebar-link"
            />
          </Stack>
        </Stack>
        <Stack
          gap={16}
          style={{ borderTop: "1px solid #23272F", paddingTop: 24 }}
        >
          <Group gap={12} align="center">
            <Avatar
              radius="xl"
              size={40}
              c="blue"
              style={{ border: "2px solid #2C2E33" }}
            >
              J
            </Avatar>
            <Button
              variant="subtle"
              c="dark"
              onClick={() => (window.location.href = "/dashboard/account")}
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                padding: 0,
                background: "none",
              }}
            >
              John Doe
            </Button>
          </Group>
          <NavLink
            label={t("settings")}
            href="/dashboard/settings"
            leftSection={<IconSettings size={18} />}
            style={{
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 8,
              padding: 8,
              transition: "background .2s, color .2s",
            }}
            active={false}
            className="sidebar-link"
          />
          <Button
            variant="subtle"
            c="red"
            leftSection={<IconLogout size={18} />}
            onClick={() => console.log("Logout")}
            style={{
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 8,
              padding: 8,
              background: "none",
              transition: "background .2s, color .2s",
            }}
            className="sidebar-link"
          >
            {t("logout")}
          </Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main style={{ backgroundColor: "#f8f9fa" }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
