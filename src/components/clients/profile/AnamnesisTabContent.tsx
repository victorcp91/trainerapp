import React from "react";
import { Stack, Card, Text, Divider, Group, Avatar } from "@mantine/core";
import { useTranslations } from "next-intl";

// Re-use or define ProgressPhotos type
interface ProgressPhotos {
  front: string;
  side: string;
  back: string;
}

interface AnamnesisTabContentProps {
  photoDates: string[];
  progressPhotos: Record<string, ProgressPhotos>;
  onPhotoClick: (date: string) => void;
}

const AnamnesisTabContent: React.FC<AnamnesisTabContentProps> = ({
  photoDates,
  progressPhotos,
  onPhotoClick,
}) => {
  const t = useTranslations();
  return (
    <Stack>
      {/* Progress Photos (Placeholder for actual Anamnesis content?) */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="md">{t("clientProfile.progress")}</Text>{" "}
        {/* Title might change - using Progress for now */}
        <Divider my="sm" />
        <Group>
          {photoDates.map((date) => (
            <Card
              key={date}
              shadow="sm"
              padding="sm"
              onClick={() => onPhotoClick(date)}
              style={{ cursor: "pointer" }}
            >
              <Text size="sm">{date}</Text>
              <Avatar
                src={progressPhotos[date]?.front}
                size={100}
                radius="md"
              />
            </Card>
          ))}
        </Group>
      </Card>
    </Stack>
  );
};

export default AnamnesisTabContent;
