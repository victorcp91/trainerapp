"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
import { Flex, Title, Card, Text, MultiSelect } from "@mantine/core";
import { IconFolder, IconStar } from "@tabler/icons-react";

const trainingModels = [
  {
    name: "Modelo de Força",
    description: "Treino focado em ganho de força muscular.",
    createdAt: "2023-03-01",
    isFavorite: true,
  },
  {
    name: "Modelo de Resistência",
    description: "Treino para melhorar a resistência física.",
    createdAt: "2023-02-15",
    isFavorite: false,
  },
  {
    name: "Modelo de Hipertrofia",
    description: "Treino voltado para aumento de massa muscular.",
    createdAt: "2023-01-20",
    isFavorite: true,
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

const series = [
  {
    name: "Série 1",
    description: "Descrição da série 1.",
    items: ["Item 1", "Item 2", "Item 3"],
    isFavorite: true,
  },
  {
    name: "Série 2",
    description: "Descrição da série 2.",
    items: ["Item 1", "Item 2"],
    isFavorite: false,
  },
  {
    name: "Série 3",
    description: "Descrição da série 3.",
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    isFavorite: true,
  },
  {
    name: "Série 4",
    description: "Descrição da série 4.",
    items: ["Item 1", "Item 2", "Item 3"],
    isFavorite: false,
  },
  {
    name: "Série 5",
    description: "Descrição da série 5.",
    items: ["Item 1", "Item 2"],
    isFavorite: true,
  },
  {
    name: "Série 6",
    description: "Descrição da série 6.",
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    isFavorite: false,
  },
  {
    name: "Série 7",
    description: "Descrição da série 7.",
    items: ["Item 1", "Item 2", "Item 3"],
    isFavorite: true,
  },
  {
    name: "Série 8",
    description: "Descrição da série 8.",
    items: ["Item 1", "Item 2"],
    isFavorite: false,
  },
  {
    name: "Série 9",
    description: "Descrição da série 9.",
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    isFavorite: true,
  },
  {
    name: "Série 10",
    description: "Descrição da série 10.",
    items: ["Item 1", "Item 2", "Item 3"],
    isFavorite: false,
  },
];

const TrainingModelsPage = () => {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [selectedSeriesLevels, setSelectedSeriesLevels] = useState<string[]>(
    []
  );
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [seriesSortOrder, setSeriesSortOrder] = useState("recent");
  const [showSeriesFavoritesOnly, setShowSeriesFavoritesOnly] = useState(false);

  const filteredTrainingModels = trainingModels
    .filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((model) => !showFavoritesOnly || model.isFavorite);

  const sortedTrainingModels = [...filteredTrainingModels].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const filteredSeries = series
    .filter((serie) =>
      serie.name.toLowerCase().includes(seriesSearchTerm.toLowerCase())
    )
    .filter((serie) => !showSeriesFavoritesOnly || serie.isFavorite);

  const sortedSeries = [...filteredSeries].sort((a, b) => {
    if (seriesSortOrder === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <Flex
      direction="column"
      style={{
        height: "calc(100vh - 40px)",
        overflow: "hidden",
      }}
    >
      <Title order={2} mb="lg" style={{ width: "100%" }}>
        Modelos de Treino
      </Title>
      <Flex flex={1} style={{ overflow: "hidden" }}>
        {" "}
        {/* Impede o scroll no container principal */}
        <Flex
          direction="column"
          style={{ flex: 2, marginRight: "1rem", overflow: "hidden" }}
        >
          <Flex mb="lg" gap="md" align="flex-start">
            <Flex direction="column" style={{ flex: 1 }}>
              <Text>Nível de Treino</Text>
              <MultiSelect
                data={levels}
                value={selectedLevels}
                onChange={setSelectedLevels}
                placeholder="Selecione níveis"
                clearable
              />
            </Flex>
            <Flex direction="column" style={{ flex: 1 }}>
              <Text>Grupos Musculares</Text>
              <MultiSelect
                data={muscleGroups}
                value={selectedMuscleGroups}
                onChange={setSelectedMuscleGroups}
                placeholder="Selecione grupos"
                clearable
              />
            </Flex>
            <Flex direction="column" style={{ flex: 1 }}>
              <Text>Ordenar por</Text>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              >
                <option value="recent">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
              </select>
            </Flex>
          </Flex>

          <Flex mb="lg" gap="md" align="center">
            <input
              type="text"
              placeholder="Buscar por nome do treino"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              Favoritos
            </label>
          </Flex>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {sortedTrainingModels.map((model, index) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <Title order={4}>{model.name}</Title>
                  </Flex>
                  <Flex>
                    <IconStar
                      size={20}
                      color="#FFD700"
                      style={{ cursor: "pointer" }}
                    />
                  </Flex>
                </Flex>
                <Text size="sm" color="dimmed">
                  {model.description}
                </Text>
              </Card>
            ))}
          </div>
        </Flex>
        <Flex
          direction="column"
          style={{
            flex: 1,
            marginTop: "0rem",
            backgroundColor: "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            height: "100%",
            overflow: "hidden", // Impede o scroll na área de séries inteira
          }}
        >
          <Flex mb="lg" gap="md" align="flex-start">
            <Flex direction="column" style={{ flex: 1 }}>
              <Text>Nível de Série</Text>
              <MultiSelect
                data={levels}
                value={selectedSeriesLevels}
                onChange={setSelectedSeriesLevels}
                placeholder="Selecione níveis"
                clearable
              />
            </Flex>
            <Flex direction="column" style={{ flex: 1 }}>
              <Text>Ordenar por</Text>
              <select
                value={seriesSortOrder}
                onChange={(e) => setSeriesSortOrder(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              >
                <option value="recent">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
              </select>
            </Flex>
          </Flex>

          <Flex mb="lg" gap="md" align="center">
            <input
              type="text"
              placeholder="Buscar por nome da série"
              value={seriesSearchTerm}
              onChange={(e) => setSeriesSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showSeriesFavoritesOnly}
                onChange={(e) => setShowSeriesFavoritesOnly(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              Favoritos
            </label>
          </Flex>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {" "}
            {/* Scroll apenas para séries */}
            {sortedSeries.map((serie, index) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                mb="md"
                style={{
                  cursor: "pointer",
                  marginTop: index === 0 ? "0" : "1rem",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <IconFolder
                      size={24}
                      color="teal"
                      style={{ marginRight: "0.5rem" }}
                    />
                    <Title order={4}>{serie.name}</Title>
                  </Flex>
                  <Flex>
                    <IconStar
                      size={20}
                      color="#FFD700"
                      style={{ cursor: "pointer" }}
                    />
                  </Flex>
                </Flex>
                <Text size="sm" color="dimmed">
                  {serie.description}
                </Text>
              </Card>
            ))}
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default withAuth(TrainingModelsPage, true);
