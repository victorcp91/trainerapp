import React, { useState } from "react";
import { Modal, TextInput, Select, Button } from "@mantine/core";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
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
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("trainingModels.createSeriesModal.title")}
    >
      <TextInput
        label={t("trainingModels.createSeriesModal.nameLabel")}
        placeholder={t("trainingModels.createSeriesModal.namePlaceholder")}
        value={newSeriesName}
        onChange={(e) => setNewSeriesName(e.target.value)}
        required
        mb="md"
      />
      <TextInput
        label={t("common.description")}
        placeholder={t(
          "trainingModels.createSeriesModal.descriptionPlaceholder"
        )}
        value={newSeriesDescription}
        onChange={(e) => setNewSeriesDescription(e.target.value)}
        mb="md"
      />
      <Select
        label={t("trainingModels.createSeriesModal.levelLabel")}
        placeholder={t("trainingModels.createSeriesModal.levelPlaceholder")}
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
        {t("common.save")}
      </Button>
    </Modal>
  );
};

export default CreateSeriesModal;
