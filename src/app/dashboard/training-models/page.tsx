"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  Title,
  Card,
  Text,
  Button,
  Container,
  Grid,
  Group,
} from "@mantine/core";
import { IconFolder, IconStar, IconPlus } from "@tabler/icons-react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { ExerciseModal } from "@/components/dashboard";
import { useTranslations } from "next-intl";

// Import types from the new location
import type {
  TrainingModel,
  Serie,
  LevelOption,
  MuscleGroupOption,
} from "@/types/training";
import type { ExerciseModalSaveData } from "@/types/modal";

// Import newly created components
import TrainingModelFilters from "@/components/trainingModels/TrainingModelFilters";
import TrainingModelList from "@/components/trainingModels/TrainingModelList";
import SeriesFilters from "@/components/trainingModels/SeriesFilters";
import SeriesList from "@/components/trainingModels/SeriesList";
import CreateSeriesModal from "@/components/trainingModels/CreateSeriesModal";

// Mock Data (Types are now imported)
const trainingModelsData: TrainingModel[] = [
  {
    id: "tm-1",
    name: "Modelo de Força",
    description: "Treino focado em ganho de força muscular.",
    createdAt: "2023-03-01",
    isFavorite: true,
    exercises: [],
  },
  {
    id: "tm-2",
    name: "Modelo de Resistência",
    description: "Treino para melhorar a resistência física.",
    createdAt: "2023-02-15",
    isFavorite: false,
    exercises: [],
  },
  {
    id: "tm-3",
    name: "Modelo de Hipertrofia",
    description: "Treino voltado para aumento de massa muscular.",
    createdAt: "2023-01-20",
    isFavorite: true,
    exercises: [],
  },
];

const levelsData: LevelOption[] = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const muscleGroupsData: MuscleGroupOption[] = [
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  // ... other groups
];

const seriesData: Serie[] = [
  {
    id: "s-1",
    name: "Série 1",
    description: "Descrição da série 1.",
    isFavorite: true,
    createdAt: "2023-03-01",
    level: "iniciante",
  },
  {
    id: "s-2",
    name: "Série 2",
    description: "Descrição da série 2.",
    isFavorite: false,
    createdAt: "2023-02-15",
    level: "intermediario",
  },
  // ... add other series with unique IDs
];

const TrainingModelsPage = () => {
  const t = useTranslations();
  // State uses imported types
  const [currentTrainingModels, setCurrentTrainingModels] =
    useState<TrainingModel[]>(trainingModelsData);
  const [currentSeries, setCurrentSeries] = useState<Serie[]>(seriesData);
  const [editingModel, setEditingModel] = useState<TrainingModel | null>(null);

  // --- State Management ---
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
  const [seriesLevelFilter, setSeriesLevelFilter] = useState<string[]>([]);
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [seriesSortOrder, setSeriesSortOrder] = useState("recent");
  const [showSeriesFavoritesOnly, setShowSeriesFavoritesOnly] = useState(false);

  const [droppedItems, setDroppedItems] = useState<Record<string, string[]>>(
    {}
  );
  const [activeDragItem, setActiveDragItem] = useState<TrainingModel | null>(
    null
  );
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>(
    {}
  );

  const [exerciseModalOpened, setExerciseModalOpened] = useState(false);
  const [seriesModalOpened, setSeriesModalOpened] = useState(false);

  // --- Event Handlers & Logic ---
  const handleCreateSeries = (newSeriesData: {
    name: string;
    description: string;
    level: string;
  }) => {
    const newSerie: Serie = {
      id: `s-${Date.now()}`,
      name: newSeriesData.name,
      description: newSeriesData.description,
      level: newSeriesData.level,
      isFavorite: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCurrentSeries((prev: Serie[]) => [...prev, newSerie]);
  };

  const toggleSeriesExpansion = (serieId: string) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [serieId]: !prev[serieId],
    }));
  };

  const handleSeriesNameClick = (serieId: string) => {
    if (hasDroppedItems(serieId)) {
      toggleSeriesExpansion(serieId);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedItemId = String(active.id);
    const draggedItem = currentTrainingModels.find(
      (model) => model.id === draggedItemId
    );
    if (draggedItem) {
      setActiveDragItem(draggedItem);
    }
    document.body.classList.add("dragging");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    document.body.classList.remove("dragging");

    if (over && active) {
      const sourceModelId: string = String(active.id);
      const targetSerieId: string = String(over.id);

      const draggedModel = currentTrainingModels.find(
        (model) => model.id === sourceModelId
      );
      if (!draggedModel) return;

      setDroppedItems((prev) => {
        const updated = { ...prev };
        const targetItems = updated[targetSerieId] || [];
        if (!targetItems.includes(draggedModel.name)) {
          updated[targetSerieId] = [...targetItems, draggedModel.name];
        }
        return updated;
      });

      setExpandedSeries((prev) => ({
        ...prev,
        [targetSerieId]: true,
      }));
    }
  };

  const handleCardClick = () => {
    // No action needed here
  };

  const handleRemoveDroppedItem = (serieId: string, position: number) => {
    setDroppedItems((prev) => {
      const updated = { ...prev };
      if (updated[serieId]) {
        updated[serieId] = updated[serieId].filter(
          (_, index) => index !== position
        );
        if (updated[serieId].length === 0) {
          setExpandedSeries((prevExpanded) => ({
            ...prevExpanded,
            [serieId]: false,
          }));
        }
      }
      return updated;
    });
  };

  const hasDroppedItems = (serieId: string): boolean => {
    return !!droppedItems[serieId] && droppedItems[serieId].length > 0;
  };

  const getDroppedItemCount = (serieId: string): number => {
    return droppedItems[serieId]?.length || 0;
  };

  const handleEditModel = (model: TrainingModel, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setEditingModel(model);
    setExerciseModalOpened(true);
  };

  const toggleTrainingModelFavorite = (
    modelToToggle: TrainingModel,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentTrainingModels((prevModels) =>
      prevModels.map((model) =>
        model.id === modelToToggle.id
          ? { ...model, isFavorite: !model.isFavorite }
          : model
      )
    );
  };

  const toggleSerieFavorite = (
    serieIdToToggle: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentSeries((prevSeries: Serie[]) =>
      prevSeries.map((serie: Serie) =>
        serie.id === serieIdToToggle
          ? { ...serie, isFavorite: !serie.isFavorite }
          : serie
      )
    );
  };

  useEffect(() => {
    if (editingModel) {
      setExerciseModalOpened(true);
    }
  }, [editingModel]);

  // --- Data Filtering & Sorting (Should be okay) ---
  const filteredTrainingModels = currentTrainingModels
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

  const filteredSeries = currentSeries
    .filter((serie) =>
      serie.name.toLowerCase().includes(seriesSearchTerm.toLowerCase())
    )
    .filter((serie) => !showSeriesFavoritesOnly || serie.isFavorite)
    .filter(
      (serie) =>
        seriesLevelFilter.length === 0 ||
        seriesLevelFilter.includes(serie.level)
    );

  const sortedSeries = [...filteredSeries].sort((a, b) => {
    if (seriesSortOrder === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  // Update the signature and logic for handleModalSave
  const handleModalSave = (saveData: ExerciseModalSaveData) => {
    console.log("Exercise modal saved:", saveData);
    if (editingModel) {
      console.log("Updating Training Model:", editingModel.id);
      setCurrentTrainingModels((prev) =>
        prev.map((m) =>
          m.id === editingModel.id
            ? {
                ...m,
                name: saveData.name,
                description: saveData.description,
                exercises: saveData.exercises,
              }
            : m
        )
      );
    } else {
      console.log("Creating new Training Model:");
      const newModel: TrainingModel = {
        id: `tm-${Date.now()}`,
        name: saveData.name || "Novo Treino",
        description: saveData.description || "",
        createdAt: new Date().toISOString().split("T")[0],
        isFavorite: false,
        exercises: saveData.exercises,
      };
      setCurrentTrainingModels((prev) => [...prev, newModel]);
    }
    setExerciseModalOpened(false);
    setEditingModel(null);
  };

  // --- Render ---
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Container size="xl" py="xl">
        <Title order={2} mb="md">
          {t("trainingModels.pageTitle")}
        </Title>
        <Grid gutter="xl" align="stretch">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Group align="center" justify="space-between" mb="md">
              <div />
              <Group gap="sm">
                <Button
                  variant="filled"
                  color="green"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    setEditingModel(null);
                    setExerciseModalOpened(true);
                  }}
                >
                  {t("trainingModels.createTrainingButton")}
                </Button>
                <Button
                  variant="filled"
                  color="blue"
                  leftSection={<IconFolder size={16} />}
                  onClick={() => setSeriesModalOpened(true)}
                >
                  {t("trainingModels.createSeriesButton")}
                </Button>
              </Group>
            </Group>

            <TrainingModelFilters
              selectedLevels={selectedLevels}
              setSelectedLevels={setSelectedLevels}
              levels={levelsData}
              selectedMuscleGroups={selectedMuscleGroups}
              setSelectedMuscleGroups={setSelectedMuscleGroups}
              muscleGroups={muscleGroupsData}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFavoritesOnly={showFavoritesOnly}
              setShowFavoritesOnly={setShowFavoritesOnly}
            />

            <div style={{ height: "calc(100vh - 250px)", overflowY: "auto" }}>
              <TrainingModelList
                models={sortedTrainingModels}
                handleCardClick={handleCardClick}
                handleEditModel={handleEditModel}
                toggleFavorite={toggleTrainingModelFavorite}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card
              withBorder
              shadow="sm"
              padding="lg"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Title order={4} mb="sm">
                {t("trainingModels.seriesTitle")}
              </Title>

              <SeriesFilters
                selectedSeriesLevels={selectedSeriesLevels}
                setSelectedSeriesLevels={setSelectedSeriesLevels}
                seriesLevelFilter={seriesLevelFilter}
                setSeriesLevelFilter={setSeriesLevelFilter}
                levels={levelsData}
                seriesSortOrder={seriesSortOrder}
                setSeriesSortOrder={setSeriesSortOrder}
                seriesSearchTerm={seriesSearchTerm}
                setSeriesSearchTerm={setSeriesSearchTerm}
                showSeriesFavoritesOnly={showSeriesFavoritesOnly}
                setShowSeriesFavoritesOnly={setShowSeriesFavoritesOnly}
              />

              <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                <SeriesList
                  series={sortedSeries}
                  droppedItems={droppedItems}
                  expandedSeries={expandedSeries}
                  handleSeriesNameClick={handleSeriesNameClick}
                  getDroppedItemCount={getDroppedItemCount}
                  toggleFavorite={toggleSerieFavorite}
                  toggleSeriesExpansion={toggleSeriesExpansion}
                  handleRemoveDroppedItem={handleRemoveDroppedItem}
                  hasDroppedItems={hasDroppedItems}
                />
              </div>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      <DragOverlay dropAnimation={null}>
        {activeDragItem && (
          <Card
            shadow="md"
            padding="lg"
            radius="md"
            style={{
              backgroundColor: "white",
              opacity: 0.9,
              cursor: "grabbing",
            }}
          >
            <Flex align="center" justify="space-between">
              <Title order={4}>{activeDragItem.name}</Title>
              <IconStar
                size={20}
                color={activeDragItem.isFavorite ? "#FFD700" : "gray"}
                fill={activeDragItem.isFavorite ? "#FFD700" : "none"}
              />
            </Flex>
            <Text size="sm" color="dimmed" mt="xs">
              {activeDragItem.description}
            </Text>
          </Card>
        )}
      </DragOverlay>

      <ExerciseModal
        handleModalClose={() => {
          setExerciseModalOpened(false);
          setEditingModel(null);
        }}
        handleModalSave={handleModalSave}
        modalOpened={exerciseModalOpened}
        editingModel={editingModel}
      />

      <CreateSeriesModal
        opened={seriesModalOpened}
        onClose={() => setSeriesModalOpened(false)}
        onCreate={handleCreateSeries}
        levels={levelsData}
      />
    </DndContext>
  );
};

export default TrainingModelsPage;
