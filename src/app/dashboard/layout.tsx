"use client";

import { Anchor, AppShell, Burger, NavLink, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

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
      <AppShell.Navbar p="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title order={1}>
          <NavLink label="TrainerApp" href="/dashboard" />
        </Title>
        <NavLink href="/dashboard" label="Dashboard" />
        <NavLink href="/dashboard/clients" label="Alunos" />
        <NavLink href="/dashboard/messages" label="Calendário" />
        <NavLink href="/dashboard/messages" label="Planos de treino" />
        <NavLink href="/dashboard/account" label="Minha conta" />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
