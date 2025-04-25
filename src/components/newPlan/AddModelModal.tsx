import { useState } from "react";
import { Modal, TextInput, Card, Group, Text, Button } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { TrainingModel } from "@/types/training";

// Assuming Level type is defined or imported - Remove if levels prop is removed
// interface Level {
//   value: string;
//   label: string;
// }

/* // Remove local TrainingModel interface
interface TrainingModel {
  name: string;
  description: string;
  level: string;
  exercises: Exercise[];
}
*/

interface AddModelModalProps {
  opened: boolean;
  onClose: () => void;
  // levels: Level[]; // Remove levels prop
  trainingModels: TrainingModel[]; // Use imported TrainingModel
  onConfirm: (selectedModel: TrainingModel) => void; // Use imported TrainingModel
}

export function AddModelModal({
  opened,
  onClose,
  // levels, // Remove levels prop
  trainingModels,
  onConfirm,
}: AddModelModalProps) {
  // Internal state for the modal
  const [searchTerm, setSearchTerm] = useState("");
  // const [levelFilter, setLevelFilter] = useState<string[]>([]); // Remove level filter state
  const [selectedModel, setSelectedModel] = useState<TrainingModel | null>(
    null
  );

  const filteredModels = trainingModels.filter((model) => {
    const nameMatch = model.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // const levelMatch = // Remove level filter logic
    //   levelFilter.length === 0 || levelFilter.includes(model.level);
    // return nameMatch && levelMatch;
    return nameMatch; // Only filter by name
  });

  const handleConfirm = () => {
    if (selectedModel) {
      onConfirm(selectedModel); // Pass the selected model up
      handleClose(); // Close after confirmation
    }
  };

  const handleClose = () => {
    // Reset internal state on close
    setSearchTerm("");
    // setLevelFilter([]); // Remove level filter reset
    setSelectedModel(null);
    onClose(); // Call the parent's close handler
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose} // Use the combined handler
      title="Adicionar Modelo de Treino ao Dia"
    >
      <TextInput
        placeholder="Buscar por nome do modelo"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="md"
      />
      {/* Remove MultiSelect for level filter 
      <MultiSelect
        data={levels}
        value={levelFilter}
        onChange={setLevelFilter}
        placeholder="Filtrar por nível"
        clearable
        mb="md"
      />
      */}
      <div style={{ maxHeight: 250, overflowY: "auto", marginBottom: 16 }}>
        {filteredModels.length === 0 && (
          <Text size="sm" c="dimmed">
            Nenhum modelo encontrado.
          </Text>
        )}
        {filteredModels.map((model, idx) => (
          <Card
            key={model.name + idx}
            shadow="sm"
            padding="md"
            mb="sm"
            style={{
              cursor: "pointer",
              border:
                selectedModel?.name === model.name
                  ? "2px solid #1971c2"
                  : "1px solid #eee",
            }}
            onClick={() => setSelectedModel(model)} // Update internal state
          >
            <Group align="center" justify="space-between">
              <div>
                <Text fw={500}>{model.name}</Text>
                <Text size="xs" c="dimmed">
                  {model.description}
                </Text>
              </div>
              {selectedModel?.name === model.name && (
                <IconStar size={18} color="#1971c2" />
              )}
            </Group>
          </Card>
        ))}
      </div>
      <Button
        variant="filled"
        color="green"
        fullWidth
        mt="md"
        disabled={!selectedModel} // Disable based on internal state
        onClick={handleConfirm} // Use internal confirm handler
      >
        Adicionar ao Dia Atual
      </Button>
    </Modal>
  );
}
