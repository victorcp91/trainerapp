import {
  Card,
  Text,
  Group,
  Stack,
  Divider,
  Button,
  Select,
  Textarea,
  MultiSelect,
  TextInput,
  Modal,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconStar, IconHeart } from "@tabler/icons-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Exercise } from "../../types/exercise"; // Use relative path
import { useTranslations } from "next-intl";

// Assuming these types/constants are defined elsewhere and imported or passed as props
interface SerieModel {
  value: string;
  label: string;
  level: string;
}

interface Level {
  value: string;
  label: string;
}

interface TrainingDayForForm {
  // Use a more specific name if needed
  date: Date;
  exercises: Exercise[];
}

interface SerieModelTraining {
  // Use a more specific name if needed
  name: string;
  exercises: Exercise[];
}

interface SeriesInfoFormProps {
  // Values
  startDate: Date | null;
  endDate: Date | null;
  selectedTrainingType: string | null;
  selectedSerieModel: string | null;
  triedSerieModelSearch: boolean;
  // Data Sources
  serieModels: SerieModel[];
  levels: Level[];
  trainingDays: TrainingDayForForm[];
  dayAssignments: string[];
  serieModelTrainings: { [key: string]: SerieModelTraining[] };
  // Modals
  seriesModalOpened: boolean;
  applySerieModalOpened: boolean;
  onCloseSeriesModal: () => void;
  onCloseApplySerieModal: () => void;
  // Callbacks/Handlers (Consolidated)
  onDateRangeChange: (start: Date | null, end: Date | null) => void; // New consolidated handler
  onSelectedTrainingTypeChange: (value: string | null) => void; // Renamed/Consolidated handler
  onDayAssignmentChange: (index: number, value: string | null) => void;
  onOpenSeriesModal: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onAddSerieToPlan: (serieValue: string) => void;
  onApplySerieToPlan: () => void;
  // Setters (Keep only those not consolidated)
  setTriedSerieModelSearch: (value: boolean) => void;
}

export function SeriesInfoForm({
  // Values
  startDate,
  endDate,
  selectedTrainingType,
  selectedSerieModel,
  triedSerieModelSearch,
  // Data Sources
  serieModels,
  levels,
  seriesModalOpened,
  applySerieModalOpened,
  trainingDays,
  dayAssignments,
  serieModelTrainings,
  // Callbacks/Handlers
  onDateRangeChange, // Use new handler
  onSelectedTrainingTypeChange, // Use new handler
  onDayAssignmentChange,
  onOpenSeriesModal, // Keep
  onSaveDraft, // Keep
  onPublish, // Keep
  onCloseSeriesModal, // Keep
  onAddSerieToPlan, // Keep
  onCloseApplySerieModal, // Keep
  onApplySerieToPlan, // Keep
  // Setters
  setTriedSerieModelSearch,
}: SeriesInfoFormProps) {
  const t = useTranslations();
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [seriesLevelFilter, setSeriesLevelFilter] = useState<string[]>([]);

  const filteredSeriesModels = serieModels.filter(
    (serie) =>
      serie.label.toLowerCase().includes(seriesSearchTerm.toLowerCase()) &&
      (seriesLevelFilter.length === 0 ||
        seriesLevelFilter.includes(serie.level))
  );

  return (
    <Card shadow="sm" padding="lg">
      <Text size="md">Informações da Série</Text>
      <Divider my="sm" />
      <Stack>
        <Select
          label={t("newPlan.seriesInfo.trainingTypeLabel")}
          placeholder={t("newPlan.seriesInfo.selectTypePlaceholder")}
          data={[
            "Hipertrofia",
            "Emagrecimento",
            "Força",
            "Resistência muscular",
            "Condicionamento físico geral",
          ]}
          value={selectedTrainingType}
          onChange={onSelectedTrainingTypeChange} // Use consolidated handler
        />
        <Group grow>
          <DateInput
            locale="pt-BR"
            label="Data de Início"
            value={startDate}
            onChange={(date) => {
              onDateRangeChange(date, endDate); // Use consolidated handler
              setTriedSerieModelSearch(false); // Keep this related setter
            }}
            error={
              triedSerieModelSearch && !startDate
                ? "Campo obrigatório"
                : undefined
            }
            styles={
              triedSerieModelSearch && !startDate
                ? { input: { borderColor: "red" } }
                : {}
            }
          />
          <DateInput
            locale="pt-BR"
            label="Data de Expiração"
            value={endDate}
            onChange={(date) => {
              onDateRangeChange(startDate, date); // Use consolidated handler
              setTriedSerieModelSearch(false); // Keep this related setter
            }}
            error={
              triedSerieModelSearch && !endDate
                ? "Campo obrigatório"
                : undefined
            }
            styles={
              triedSerieModelSearch && !endDate
                ? { input: { borderColor: "red" } }
                : {}
            }
          />
        </Group>
        <Textarea
          label="Observações"
          placeholder="Adicione observações sobre o treino"
        />
        <Group mt="md" justify="space-between">
          <Button variant="outline" c="gray" onClick={onOpenSeriesModal}>
            Buscar e adicionar série do modelo
          </Button>
          <Group gap="lg">
            <Button
              variant="outline"
              c="blue"
              leftSection={<IconStar />}
              onClick={onSaveDraft}
            >
              Salvar Rascunho
            </Button>
            <Button
              variant="filled"
              c="green"
              leftSection={<IconHeart />}
              onClick={onPublish}
              disabled={!startDate || !endDate || !selectedTrainingType}
            >
              Publicar
            </Button>
          </Group>
        </Group>
        {selectedSerieModel && (
          <div style={{ minWidth: 200 }}>
            <Text size="sm">
              {serieModels.find((s) => s.value === selectedSerieModel)?.label}
            </Text>
            <Text size="xs" c="dimmed">
              Nível:{" "}
              {
                levels.find(
                  (l) =>
                    l.value ===
                    serieModels.find((s) => s.value === selectedSerieModel)
                      ?.level
                )?.label
              }
            </Text>
          </div>
        )}
        <Modal
          opened={seriesModalOpened}
          onClose={onCloseSeriesModal}
          title="Buscar série do modelo"
          size="lg"
        >
          <TextInput
            placeholder={t("newPlan.seriesInfo.searchByNamePlaceholder")}
            value={seriesSearchTerm}
            onChange={(event) => setSeriesSearchTerm(event.currentTarget.value)}
          />
          <MultiSelect
            data={levels.map((l) => ({ value: l.value, label: l.label }))}
            value={seriesLevelFilter}
            onChange={setSeriesLevelFilter}
            placeholder="Filtrar por nível"
            clearable
          />
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {filteredSeriesModels.length > 0 ? (
              filteredSeriesModels.map((serie) => (
                <Card key={serie.value} shadow="sm" padding="sm" mb="xs">
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text>{serie.label}</Text>
                      <Text size="xs" c="dimmed">
                        Nível:{" "}
                        {levels.find((l) => l.value === serie.level)?.label}
                      </Text>
                    </Stack>
                    <Button onClick={() => onAddSerieToPlan(serie.value)}>
                      Adicionar
                    </Button>
                  </Group>
                </Card>
              ))
            ) : (
              <Text size="sm" c="dimmed">
                Nenhuma série encontrada.
              </Text>
            )}
          </div>
        </Modal>
        <Modal
          opened={applySerieModalOpened}
          onClose={onCloseApplySerieModal}
          title="Aplicar série ao plano"
          size="lg"
        >
          <Text mb="md">
            Configure como a série será aplicada aos dias da semana:
          </Text>
          {trainingDays.slice(0, 7).map((day, index) => (
            <Group key={index} mb="sm" justify="space-between">
              <Text>{format(day.date, "EEEE", { locale: ptBR })}</Text>
              <Select
                data={[
                  { value: "Descanso", label: "Descanso" },
                  ...(serieModelTrainings[selectedSerieModel || ""] || []).map(
                    (t) => ({ value: t.name, label: t.name })
                  ),
                ]}
                value={dayAssignments[index]}
                onChange={(value) => onDayAssignmentChange(index, value)}
              />
            </Group>
          ))}
          <Button mt="md" onClick={onApplySerieToPlan}>
            Confirmar e Aplicar
          </Button>
        </Modal>
      </Stack>
    </Card>
  );
}
