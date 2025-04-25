import React from "react";
import { Stack, Card, Text, Divider, Group, Avatar } from "@mantine/core";
import { useTranslations } from "next-intl";

interface ProgressPhotos {
  front: string;
  side: string;
  back: string;
}

interface EvolutionTabContentProps {
  photoDates: string[];
  progressPhotos: Record<string, ProgressPhotos>;
  onPhotoClick: (date: string) => void;
}

const EvolutionTabContent: React.FC<EvolutionTabContentProps> = ({
  photoDates,
  progressPhotos,
  onPhotoClick,
}) => {
  const t = useTranslations();
  return (
    <Stack>
      {/* Progress Photos */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="md">{t("clientProfile.progress")}</Text>
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
                src={progressPhotos[date]?.front} // Added optional chaining
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

export default EvolutionTabContent;
