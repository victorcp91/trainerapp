"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
import {
  Button,
  Flex,
  Title,
  Card,
  Text,
  Tabs,
  MultiSelect,
} from "@mantine/core";

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

const levels = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const muscleGroups = [
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  { value: "pernas", label: "Pernas" },
  { value: "ombros", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
];

const TrainingModelsPage = () => {
  const [currentTab, setCurrentTab] = useState<string>("series");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );

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
          <Flex justify="space-between" align="center" mb="lg">
            <Flex gap="md">
              <MultiSelect
                data={levels}
                placeholder="Filtrar por Nível"
                value={selectedLevels}
                onChange={setSelectedLevels}
                clearable
              />
              <MultiSelect
                data={muscleGroups}
                placeholder="Filtrar por Grupo Muscular"
                value={selectedMuscleGroups}
                onChange={setSelectedMuscleGroups}
                clearable
              />
            </Flex>
            <Button variant="filled">Criar Treino</Button>
          </Flex>
          <Text>Conteúdo relacionado a treinos será exibido aqui.</Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default withAuth(TrainingModelsPage, true);
