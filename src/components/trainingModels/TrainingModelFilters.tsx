import React from "react";
import {
  Flex,
  Text,
  MultiSelect,
  Select,
  TextInput,
  Checkbox,
} from "@mantine/core";

interface Option {
  value: string;
  label: string;
}

interface TrainingModelFiltersProps {
  selectedLevels: string[];
  setSelectedLevels: (value: string[]) => void;
  levels: Option[];
  selectedMuscleGroups: string[];
  setSelectedMuscleGroups: (value: string[]) => void;
  muscleGroups: Option[];
  sortOrder: string;
  setSortOrder: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (value: boolean) => void;
}

export const TrainingModelFilters: React.FC<TrainingModelFiltersProps> = ({
  selectedLevels,
  setSelectedLevels,
  levels,
  selectedMuscleGroups,
  setSelectedMuscleGroups,
  muscleGroups,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
  showFavoritesOnly,
  setShowFavoritesOnly,
}) => {
  return (
    <>
      <Flex mb="md" gap="md" align="flex-start">
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            Nível de Treino
          </Text>
          <MultiSelect
            data={levels}
            value={selectedLevels}
            onChange={setSelectedLevels}
            placeholder="Selecione níveis"
            clearable
          />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            Grupos Musculares
          </Text>
          <MultiSelect
            data={muscleGroups}
            value={selectedMuscleGroups}
            onChange={setSelectedMuscleGroups}
            placeholder="Selecione grupos"
            clearable
          />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            Ordenar por
          </Text>
          {/* Using Mantine Select for consistency */}
          <Select
            data={[
              { value: "recent", label: "Mais Recentes" },
              { value: "oldest", label: "Mais Antigos" },
            ]}
            value={sortOrder}
            onChange={(value) => setSortOrder(value || "recent")} // Handle null case
          />
        </Flex>
      </Flex>
      <Flex mb="md" gap="md" align="center">
        <TextInput
          placeholder="Buscar por nome do treino"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Checkbox
          label="Favoritos"
          checked={showFavoritesOnly}
          onChange={(event) =>
            setShowFavoritesOnly(event.currentTarget.checked)
          }
        />
      </Flex>
    </>
  );
};

export default TrainingModelFilters;
