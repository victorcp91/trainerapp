"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
import { Button, Flex, Title, Card, Text, Tabs } from "@mantine/core";

const trainingModels = [
  {
    name: "Modelo de Força",
    description: "Treino focado em ganho de força muscular.",
  },
  {
    name: "Modelo de Resistência",
    description: "Treino para melhorar a resistência física.",
  },
  {
    name: "Modelo de Hipertrofia",
    description: "Treino voltado para aumento de massa muscular.",
  },
];

const TrainingModelsPage = () => {
  const [currentTab, setCurrentTab] = useState<string>("series");

  const handleTabChange = (value: string | null) => {
    if (value) {
      setCurrentTab(value);
    }
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>Modelos de Treino</Title>
      </Flex>

      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="series">Séries</Tabs.Tab>
          <Tabs.Tab value="trainings">Treinos</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="series" pt="md">
          {trainingModels.map((model, index) => (
            <Card key={index} shadow="sm" padding="lg" mb="md">
              <Title order={4}>{model.name}</Title>
              <Text size="sm" color="dimmed">
                {model.description}
              </Text>
            </Card>
          ))}
        </Tabs.Panel>

        <Tabs.Panel value="trainings" pt="md">
          <Text>Conteúdo relacionado a treinos será exibido aqui.</Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default withAuth(TrainingModelsPage, true);
