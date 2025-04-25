import React from "react";
import {
  Flex,
  Text,
  MultiSelect,
  Select,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  return (
    <>
      <Flex mb="md" gap="md" align="flex-start">
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            {t("trainingModels.filters.levelLabel")}
          </Text>
          <MultiSelect
            data={levels}
            value={selectedLevels}
            onChange={setSelectedLevels}
            placeholder={t("trainingModels.filters.selectLevelsPlaceholder")}
            clearable
          />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            {t("trainingModels.filters.muscleGroupsLabel")}
          </Text>
          <MultiSelect
            data={muscleGroups}
            value={selectedMuscleGroups}
            onChange={setSelectedMuscleGroups}
            placeholder={t("trainingModels.filters.selectGroupsPlaceholder")}
            clearable
          />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            {t("common.sortBy")}
          </Text>
          {/* Using Mantine Select for consistency */}
          <Select
            data={[
              { value: "recent", label: t("common.sort.recent") },
              { value: "oldest", label: t("common.sort.oldest") },
            ]}
            value={sortOrder}
            onChange={(value) => setSortOrder(value || "recent")} // Handle null case
          />
        </Flex>
      </Flex>
      <Flex mb="md" gap="md" align="center">
        <TextInput
          placeholder={t("trainingModels.filters.searchByNamePlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Checkbox
          label={t("common.favorites")}
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
