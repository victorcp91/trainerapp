import React from "react";
import { Card, Grid, TextInput, Select, Text, Stack } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { SelectClearable } from "@/components/dashboard";

interface Option {
  value: string;
  label: string;
}

interface ClientFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showClientType: string | null;
  setShowClientType: (value: string | null) => void;
  showPlanStatus: string | null;
  setShowPlanStatus: (value: string | null) => void;
  showClientStatus: string | null;
  setShowClientStatus: (value: string | null) => void;
  showGender: string | null;
  setShowGender: (value: string | null) => void;
  sortOption: string | null;
  setSortOption: (value: string | null) => void;
  clientTypeOptions: Option[];
  planStatusOptions: Option[];
  genderOptions: Option[];
  t: (key: string, params?: Record<string, string | number | Date>) => string;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  showClientType,
  setShowClientType,
  showPlanStatus,
  setShowPlanStatus,
  showClientStatus,
  setShowClientStatus,
  showGender,
  setShowGender,
  sortOption,
  setSortOption,
  clientTypeOptions,
  planStatusOptions,
  genderOptions,
  t,
}) => {
  return (
    <Card withBorder shadow="sm" p="lg" mb="xl">
      <Grid align="flex-end">
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <TextInput
            label={t("searchPlaceholder")}
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
          <Stack gap={0}>
            <Text size="sm" fw={500} mb={3}>
              {t("filterTypeLabel")}
            </Text>
            <SelectClearable
              value={showClientType}
              setValue={setShowClientType}
              options={[
                { value: "", label: t("filterTypeAll") },
                ...clientTypeOptions,
              ]}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
          <Stack gap={0}>
            <Text size="sm" fw={500} mb={3}>
              {t("filterPlanStatusLabel")}
            </Text>
            <SelectClearable
              value={showPlanStatus}
              setValue={setShowPlanStatus}
              options={[
                { value: "", label: t("filterPlanStatusAll") },
                ...planStatusOptions,
              ]}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
          <Stack gap={0}>
            <Text size="sm" fw={500} mb={3}>
              {t("filterStatusLabel")}
            </Text>
            <SelectClearable
              value={showClientStatus}
              setValue={setShowClientStatus}
              options={[
                { value: "", label: t("filterStatusAll") },
                { value: "active", label: t("filterStatusActive") },
                { value: "inactive", label: t("filterStatusInactive") },
              ]}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
          <Stack gap={0}>
            <Text size="sm" fw={500} mb={3}>
              {t("filterGenderLabel")}
            </Text>
            <SelectClearable
              value={showGender}
              setValue={setShowGender}
              options={[
                { value: "", label: t("filterGenderAll") },
                ...genderOptions,
              ]}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
          <Select
            label={t("sortLabel")}
            value={sortOption}
            onChange={setSortOption}
            data={[
              { value: "name_asc", label: t("sortNameAsc") },
              { value: "name_desc", label: t("sortNameDesc") },
              { value: "startDate_asc", label: t("sortStartDateAsc") },
              { value: "startDate_desc", label: t("sortStartDateDesc") },
            ]}
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ClientFilters;
