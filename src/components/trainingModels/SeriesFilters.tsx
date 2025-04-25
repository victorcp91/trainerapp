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

interface SeriesFiltersProps {
  selectedSeriesLevels: string[]; // This seems unused in the original code for filtering, but kept for consistency if intended later
  setSelectedSeriesLevels: (value: string[]) => void; // Kept for consistency
  seriesLevelFilter: string[];
  setSeriesLevelFilter: (value: string[]) => void;
  levels: Option[];
  seriesSortOrder: string;
  setSeriesSortOrder: (value: string) => void;
  seriesSearchTerm: string;
  setSeriesSearchTerm: (value: string) => void;
  showSeriesFavoritesOnly: boolean;
  setShowSeriesFavoritesOnly: (value: boolean) => void;
}

export const SeriesFilters: React.FC<SeriesFiltersProps> = ({
  selectedSeriesLevels, // Keep prop even if unused in filtering logic for now
  setSelectedSeriesLevels,
  seriesLevelFilter,
  setSeriesLevelFilter,
  levels,
  seriesSortOrder,
  setSeriesSortOrder,
  seriesSearchTerm,
  setSeriesSearchTerm,
  showSeriesFavoritesOnly,
  setShowSeriesFavoritesOnly,
}) => {
  return (
    <>
      {/* Top row of filters (Level Selection and Sorting) */}
      <Flex mb="md" gap="md" align="flex-start">
        {/* This MultiSelect seems redundant if seriesLevelFilter is the primary filter? */}
        {/* Keeping it based on original code structure, but clarify its purpose if needed */}
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            Nível de Série
          </Text>
          <MultiSelect
            data={levels}
            value={selectedSeriesLevels} // Connected to state
            onChange={setSelectedSeriesLevels} // Connected to state handler
            placeholder="Selecione níveis"
            clearable
          />
        </Flex>
        <Flex direction="column" style={{ flex: 1 }}>
          <Text size="sm" mb={4}>
            Ordenar por
          </Text>
          <Select
            data={[
              { value: "recent", label: "Recentes" },
              { value: "oldest", label: "Antigos" },
            ]}
            value={seriesSortOrder}
            onChange={(value) => setSeriesSortOrder(value || "recent")} // Handle null case
          />
        </Flex>
      </Flex>

      {/* Second row of filters (Level Filter and Favorites) */}
      <Flex mb="md" gap="md" align="center">
        <MultiSelect
          data={levels}
          value={seriesLevelFilter}
          onChange={setSeriesLevelFilter}
          placeholder="Filtrar por nível"
          clearable
          style={{ flex: 1, minWidth: 150 }} // Adjusted styling slightly
        />
        <Checkbox
          label="Favoritos"
          checked={showSeriesFavoritesOnly}
          onChange={(event) =>
            setShowSeriesFavoritesOnly(event.currentTarget.checked)
          }
        />
      </Flex>

      {/* Search Input */}
      <Flex mb="md">
        {" "}
        {/* Ensure search is below other filters */}
        <TextInput
          placeholder="Buscar por nome da série"
          value={seriesSearchTerm}
          onChange={(e) => setSeriesSearchTerm(e.target.value)}
          style={{
            flex: 1,
          }}
        />
      </Flex>
    </>
  );
};

export default SeriesFilters;
