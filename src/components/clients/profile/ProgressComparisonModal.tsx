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

  // Sync initial date when modal opens or initialBeforeDate changes
  useEffect(() => {
    if (isOpen) {
      setBeforeDate(initialBeforeDate);
      setAfterDate(null); // Reset after date when opening
      setSelectedAngles(["front", "side", "back"]); // Reset angles
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

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("clientProfile.progressModal.title")}
      size="lg"
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
      <Text size="sm">Ângulos</Text>
      <Group>
        {angleOptions.map((angle) => (
          <Checkbox
            key={angle.value}
            label={angle.label}
            checked={selectedAngles.includes(angle.value)}
            onChange={(e) => {
              const isChecked = e.currentTarget.checked;
              setSelectedAngles((prev) =>
                isChecked
                  ? [...prev, angle.value]
                  : prev.filter((a) => a !== angle.value)
              );
            }}
          />
        ))}
      </Group>
      <Divider my="sm" />
      {/* Ensure unique ID for html2canvas target */}
      <div
        id="comparison-container-modal"
        style={{ padding: "1rem", background: "white" }}
      >
        <Group align="flex-start">
          {beforeDate && progressPhotos[beforeDate] && (
            <Stack>
              <Text size="sm">Antes ({beforeDate})</Text>
              {selectedAngles.includes("front") && (
                <Image
                  src={progressPhotos[beforeDate].front}
                  alt="Frente Antes"
                />
              )}
              {selectedAngles.includes("side") && (
                <Image src={progressPhotos[beforeDate].side} alt="Lado Antes" />
              )}
              {selectedAngles.includes("back") && (
                <Image
                  src={progressPhotos[beforeDate].back}
                  alt="Costas Antes"
                />
              )}
            </Stack>
          )}
          {afterDate && progressPhotos[afterDate] && (
            <Stack>
              <Text size="sm">Depois ({afterDate})</Text>
              {selectedAngles.includes("front") && (
                <Image
                  src={progressPhotos[afterDate].front}
                  alt="Frente Depois"
                />
              )}
              {selectedAngles.includes("side") && (
                <Image src={progressPhotos[afterDate].side} alt="Lado Depois" />
              )}
              {selectedAngles.includes("back") && (
                <Image
                  src={progressPhotos[afterDate].back}
                  alt="Costas Depois"
                />
              )}
            </Stack>
          )}
        </Group>
      </div>
      <Divider my="sm" />
      <Group>
        <Button
          onClick={handleGenerateImage}
          disabled={!beforeDate || !afterDate}
        >
          Gerar Imagem
        </Button>
        <Button
          leftSection={<IconShare size={16} />}
          variant="outline"
          onClick={handleShare}
          disabled={!beforeDate || !afterDate} // Disable if no comparison possible
        >
          Compartilhar
        </Button>
      </Group>
    </Modal>
  );
};

export default ProgressComparisonModal;
