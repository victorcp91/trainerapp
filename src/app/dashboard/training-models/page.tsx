"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
import { Flex, Title, Card, Text, MultiSelect, Button } from "@mantine/core";
import {
  IconFolder,
  IconStar,
  IconChevronUp,
  IconChevronDown,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import {
  useDroppable,
  useDraggable,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { ExerciseModal } from "@/components/shared";

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
    isFavorite: true,
    createdAt: "2023-03-01",
  },
  {
    name: "Série 2",
    description: "Descrição da série 2.",
    isFavorite: false,
    createdAt: "2023-02-15",
  },
  {
    name: "Série 3",
    description: "Descrição da série 3.",
    isFavorite: true,
    createdAt: "2023-01-20",
  },
  {
    name: "Série 4",
    description: "Descrição da série 4.",
    isFavorite: false,
    createdAt: "2023-03-01",
  },
  {
    name: "Série 5",
    description: "Descrição da série 5.",
    isFavorite: true,
    createdAt: "2023-02-15",
  },
  {
    name: "Série 6",
    description: "Descrição da série 6.",
    isFavorite: false,
    createdAt: "2023-01-20",
  },
  {
    name: "Série 7",
    description: "Descrição da série 7.",
    isFavorite: true,
    createdAt: "2023-03-01",
  },
  {
    name: "Série 8",
    description: "Descrição da série 8.",
    isFavorite: false,
    createdAt: "2023-02-15",
  },
  {
    name: "Série 9",
    description: "Descrição da série 9.",
    isFavorite: true,
    createdAt: "2023-01-20",
  },
  {
    name: "Série 10",
    description: "Descrição da série 10.",
    isFavorite: false,
    createdAt: "2023-03-01",
  },
];

// Definição dos tipos para os componentes DraggableCard e DroppableCard
interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
}

interface DroppableCardProps {
  id: string;
  children: React.ReactNode;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const style: React.CSSProperties = {
    cursor: "grab",
    userSelect: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const DroppableCard: React.FC<DroppableCardProps> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style: React.CSSProperties = {
    backgroundColor: isOver ? "#e0ffe0" : "#ffffff", // Muda a cor apenas do card específico
    transition: "background-color 0.3s",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: isOver ? "0 0 10px rgba(0, 128, 0, 0.5)" : "none", // Adiciona destaque visual
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

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

  const [droppedItems, setDroppedItems] = useState<Record<string, string[]>>(
    {}
  );
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>(
    {}
  );

  const [exerciseModalOpened, setExerciseModalOpened] = useState(false);

  const toggleSeriesExpansion = (id: string) => {
    setExpandedSeries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSeriesNameClick = (serieId: string) => {
    if (hasDroppedItems(serieId)) {
      toggleSeriesExpansion(serieId);
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const draggedItem = trainingModels.find(
      (model) => model.name === active.id
    );
    setActiveDragItem(draggedItem);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (over) {
      const sourceId = active.id;
      const targetId = over.id;

      setDroppedItems((prev) => {
        const updated = { ...prev };
        if (!updated[targetId]) {
          updated[targetId] = [];
        }
        // Adiciona o modelo ao final da lista, mantendo a ordem
        updated[targetId] = [...updated[targetId], sourceId];
        return updated;
      });

      // Expande automaticamente o card ao adicionar um novo modelo
      setExpandedSeries((prev) => ({
        ...prev,
        [targetId]: true,
      }));
    }
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

  const hasDroppedItems = (serieId: string) => {
    return droppedItems[serieId] && droppedItems[serieId].length > 0;
  };

  const getDroppedItemCount = (serieId: string) => {
    return droppedItems[serieId]?.length || 0;
  };

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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Flex
        direction="column"
        style={{
          height: "calc(100vh - 40px)",
          overflow: "hidden",
        }}
      >
        <Flex align="center" justify="space-between" style={{ width: "100%" }}>
          <Title order={2} mb="lg">
            Modelos de Treino
          </Title>
          <Flex gap="md">
            <Button
              variant="filled"
              color="green"
              leftSection={<IconPlus size={16} />} // Ícone para "Criar Treino"
              onClick={() => setExerciseModalOpened(true)}
            >
              Criar Treino
            </Button>
            <Button
              variant="filled"
              color="blue" // Cor para "Criar Série"
              leftSection={<IconFolder size={16} />} // Ícone para "Criar Série"
              onClick={() => console.log("Criar Série")}
            >
              Criar Série
            </Button>
          </Flex>
        </Flex>
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
              }}
            >
              {sortedTrainingModels.map((model, index) => (
                <DraggableCard id={model.name} key={index}>
                  <Card
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
                </DraggableCard>
              ))}
            </div>
          </Flex>
          <Flex
            direction="column"
            style={{
              flex: 1,
              marginTop: "0rem",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              height: "100%",
              overflow: "hidden", // Impede o scroll na área de séries inteira
            }}
          >
            <Flex mb="lg" gap="md" align="flex-start" p="md" pb="0">
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
                  <option value="recent">Recentes</option>
                  <option value="oldest">Antigos</option>
                </select>
              </Flex>
            </Flex>

            <Flex mb="lg" gap="md" align="center" px="md">
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
              {sortedSeries.map((serie, index) => (
                <DroppableCard id={`serie-${index}`} key={index}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    style={{
                      cursor: "pointer",
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
                        <Title
                          order={4}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleSeriesNameClick(`serie-${index}`)
                          }
                        >
                          {serie.name}
                        </Title>
                      </Flex>
                      <Flex align="center" gap="sm">
                        <Text size="sm" color="dimmed">
                          {getDroppedItemCount(`serie-${index}`)} treinos
                        </Text>
                        <IconStar
                          size={20}
                          color="#FFD700"
                          style={{ cursor: "pointer" }}
                        />
                        {hasDroppedItems(`serie-${index}`) && (
                          <button
                            onClick={() =>
                              toggleSeriesExpansion(`serie-${index}`)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {expandedSeries[`serie-${index}`] ? (
                              <IconChevronUp size={20} color="gray" />
                            ) : (
                              <IconChevronDown size={20} color="gray" />
                            )}
                          </button>
                        )}
                      </Flex>
                    </Flex>
                    <Text size="sm" color="dimmed">
                      {serie.description}
                    </Text>
                    {expandedSeries[`serie-${index}`] && (
                      <div style={{ marginTop: "1rem" }}>
                        {droppedItems[`serie-${index}`]?.map((item, idx) => (
                          <Flex
                            key={idx}
                            id={`serie-${index}-${item}`}
                            align="center"
                            justify="space-between"
                            style={{ marginBottom: "1rem" }} // Adicionado espaçamento entre os itens
                          >
                            <Text size="sm" color="dimmed">
                              {idx + 1}. {item}
                            </Text>
                            <button
                              onClick={() =>
                                handleRemoveDroppedItem(`serie-${index}`, idx)
                              }
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <IconTrash size={20} color="red" />
                            </button>
                          </Flex>
                        ))}
                      </div>
                    )}
                  </Card>
                </DroppableCard>
              ))}
            </div>
          </Flex>
        </Flex>
      </Flex>
      <DragOverlay>
        {activeDragItem ? (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
              border: "1px solid #e0e0e0",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
            }}
          >
            <Flex align="center" justify="space-between">
              <Flex align="center">
                <Title order={4}>{activeDragItem.name}</Title>
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
              {activeDragItem.description}
            </Text>
          </Card>
        ) : null}
      </DragOverlay>
      <ExerciseModal
        handleModalClose={() => setExerciseModalOpened(false)}
        handleModalSave={(tempExercises) => console.log(tempExercises)}
        modalOpened={exerciseModalOpened}
        editingExercises={[]}
      />
    </DndContext>
  );
};

export default withAuth(TrainingModelsPage, true);
