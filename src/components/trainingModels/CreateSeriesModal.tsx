import React, { useState } from "react";
import { Modal, TextInput, Select, Button } from "@mantine/core";

interface Level {
  value: string;
  label: string;
}

interface CreateSeriesModalProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (seriesData: {
    name: string;
    description: string;
    level: string;
  }) => void;
  levels: Level[];
}

export const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({
  opened,
  onClose,
  onCreate,
  levels,
}) => {
  const [newSeriesName, setNewSeriesName] = useState("");
  const [newSeriesDescription, setNewSeriesDescription] = useState("");
  const [newSeriesLevel, setNewSeriesLevel] = useState<string | null>(null); // Use null for Select

  const handleCreateSeries = () => {
    if (newSeriesName && newSeriesLevel) {
      // Ensure required fields are filled
      onCreate({
        name: newSeriesName,
        description: newSeriesDescription,
        level: newSeriesLevel,
      });
      // Reset state after creation
      setNewSeriesName("");
      setNewSeriesDescription("");
      setNewSeriesLevel(null);
      onClose(); // Close modal after successful creation
    } else {
      // Handle validation feedback if needed
      console.error("Name and Level are required.");
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Criar Série">
      <TextInput
        label="Nome da Série"
        placeholder="Digite o nome da série"
        value={newSeriesName}
        onChange={(e) => setNewSeriesName(e.target.value)}
        required
        mb="md"
      />
      <TextInput
        label="Descrição"
        placeholder="Digite a descrição da série"
        value={newSeriesDescription}
        onChange={(e) => setNewSeriesDescription(e.target.value)}
        mb="md"
      />
      <Select
        label="Nível da Série"
        placeholder="Selecione o nível"
        data={levels}
        value={newSeriesLevel}
        onChange={setNewSeriesLevel} // Directly set the value or null
        required
        clearable // Allow clearing the selection
        mb="md"
      />
      <Button
        variant="filled"
        color="green"
        fullWidth
        mt="md"
        onClick={handleCreateSeries}
        disabled={!newSeriesName || !newSeriesLevel} // Disable if required fields are empty
      >
        Salvar
      </Button>
    </Modal>
  );
};

export default CreateSeriesModal;
