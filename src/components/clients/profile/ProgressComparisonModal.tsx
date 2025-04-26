import React, { useState, useEffect } from "react";
import {
  Modal,
  Group,
  Select,
  Divider,
  Checkbox,
  Image,
  Stack,
  Button,
  Text,
  Grid,
  Center,
  Paper,
} from "@mantine/core";
import { IconShare } from "@tabler/icons-react";
import html2canvas from "html2canvas";
import { useTranslations } from "next-intl";

interface ProgressPhotos {
  front: string;
  side: string;
  back: string;
}

interface AngleOption {
  value: string;
  label: string;
}

interface ProgressComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoDates: string[];
  progressPhotos: Record<string, ProgressPhotos>;
  initialBeforeDate: string | null; // Set initial 'before' date when modal opens
}

const angleOptions: AngleOption[] = [
  { value: "front", label: "Frente" },
  { value: "side", label: "Lado" },
  { value: "back", label: "Costas" },
];

const ProgressComparisonModal: React.FC<ProgressComparisonModalProps> = ({
  isOpen,
  onClose,
  photoDates,
  progressPhotos,
  initialBeforeDate,
}) => {
  const t = useTranslations();
  const [beforeDate, setBeforeDate] = useState<string | null>(null);
  const [afterDate, setAfterDate] = useState<string | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<string[]>([
    "front",
    "side",
    "back",
  ]);

  useEffect(() => {
    if (isOpen) {
      setBeforeDate(initialBeforeDate);
      setAfterDate(null);
      setSelectedAngles(["front", "side", "back"]);
    }
  }, [isOpen, initialBeforeDate]);

  const handleGenerateImage = async () => {
    const comparisonElement = document.getElementById(
      "comparison-container-modal"
    ); // Use unique ID
    if (comparisonElement) {
      try {
        const canvas = await html2canvas(comparisonElement, {
          useCORS: true, // Add if images are from different origins
          // scale: window.devicePixelRatio, // Optional for higher resolution
          logging: false, // Disable logging
        });
        const link = document.createElement("a");
        link.download = "comparison.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
        alert("Erro ao gerar a imagem. Verifique o console para detalhes.");
      }
    }
  };

  const handleShare = () => {
    // Implement actual sharing logic later (e.g., using Web Share API)
    alert("Funcionalidade de compartilhamento em redes sociais em breve!");
  };

  const renderComparisonImages = (date: string | null, label: string) => {
    if (!date || !progressPhotos[date]) {
      return (
        <Center h={200}>
          {" "}
          {/* Placeholder height */}
          <Text c="dimmed">
            {t("clientProfile.progressModal.selectDatePlaceholder")}
          </Text>
        </Center>
      );
    }

    const photos = progressPhotos[date];

    return (
      <Stack gap="md">
        <Text ta="center" fw={500}>{`${label} (${date})`}</Text>
        {selectedAngles.length === 0 && (
          <Center h={100}>
            <Text c="dimmed" size="sm">
              {t("clientProfile.progressModal.selectAnglePrompt")}
            </Text>
          </Center>
        )}
        {selectedAngles.map((angle) => (
          <Paper key={angle} withBorder p="xs" radius="sm">
            <Text size="xs" c="dimmed" mb={4}>
              {angleOptions.find((opt) => opt.value === angle)?.label || angle}
            </Text>
            <Image
              src={photos[angle as keyof ProgressPhotos]}
              alt={`${angle} ${label} ${date}`}
              fallbackSrc="https://placehold.co/200x200?text=No+Image"
              radius="xs"
              height={150} // Adjust as needed
              fit="contain"
            />
          </Paper>
        ))}
      </Stack>
    );
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("clientProfile.progressModal.title")}
      size="xl" // Increased size
    >
      <Group grow>
        <Select
          label={t("clientProfile.progressModal.dateBeforeLabel")}
          placeholder={t("clientProfile.progressModal.selectDatePlaceholder")}
          data={photoDates}
          value={beforeDate}
          onChange={setBeforeDate}
          clearable
        />
        <Select
          label={t("clientProfile.progressModal.dateAfterLabel")}
          placeholder={t("clientProfile.progressModal.selectDatePlaceholder")}
          data={photoDates.filter((d) => d !== beforeDate)} // Prevent selecting same date
          value={afterDate}
          onChange={setAfterDate}
          clearable
        />
      </Group>
      <Divider my="sm" />
      <Checkbox.Group
        label={t("clientProfile.progressModal.anglesLabel")}
        value={selectedAngles}
        onChange={setSelectedAngles}
      >
        <Group mt="xs">
          {angleOptions.map((angle) => (
            <Checkbox
              key={angle.value}
              value={angle.value}
              label={angle.label}
            />
          ))}
        </Group>
      </Checkbox.Group>
      <Divider my="sm" />
      <div
        id="comparison-container-modal"
        style={{ padding: "1rem", background: "white" }}
      >
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            {renderComparisonImages(
              beforeDate,
              t("clientProfile.progressModal.beforeLabel")
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            {renderComparisonImages(
              afterDate,
              t("clientProfile.progressModal.afterLabel")
            )}
          </Grid.Col>
        </Grid>
      </div>
      <Divider my="sm" />
      <Group>
        <Button
          onClick={handleGenerateImage}
          disabled={!beforeDate || !afterDate}
        >
          {t("clientProfile.progressModal.generateImageButton")}
        </Button>
        <Button
          leftSection={<IconShare size={16} />}
          variant="outline"
          onClick={handleShare}
          disabled={!beforeDate || !afterDate} // Disable if no comparison possible
        >
          {t("clientProfile.progressModal.shareButton")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ProgressComparisonModal;
