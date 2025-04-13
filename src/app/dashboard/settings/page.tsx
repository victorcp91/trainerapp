"use client";

import React, { useState } from "react";
import {
  Card,
  Stack,
  Title,
  Divider,
  Group,
  Select, // adicionado o Select
} from "@mantine/core";
import { withAuth } from "@/utils/withAuth";
import { IconSettings } from "@tabler/icons-react"; // Exemplo de ícone

function SettingsPage() {
  const [language, setLanguage] = useState<string | null>(null);

  return (
    <div style={{ padding: "24px" }}>
      <Group mb="md">
        <IconSettings size={32} />
        <Title order={2}>Configurações</Title>
      </Group>
      <Divider my="md" />
      <Card shadow="sm" p="lg">
        <Stack>
          <Select
            label="Selecione o idioma"
            placeholder="Escolha um idioma"
            data={[
              { value: "pt", label: "Português" },
              { value: "en", label: "Inglês" },
              { value: "es", label: "Espanhol" },
            ]}
            value={language}
            onChange={setLanguage}
          />
        </Stack>
      </Card>
    </div>
  );
}

export default withAuth(SettingsPage, true);
