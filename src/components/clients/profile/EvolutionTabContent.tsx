import React from "react";
import {
  Stack,
  Card,
  Text,
  Divider,
  SimpleGrid,
  Image,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { LineChart, BarChart } from "@mantine/charts";

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

// Placeholder data (replace with actual data fetching)
const weightData = [
  { date: "Mar 19", Weight: 80 },
  { date: "Apr 19", Weight: 79 },
  { date: "May 19", Weight: 78 },
  { date: "Jun 19", Weight: 77 },
  { date: "Jul 19", Weight: 76.5 },
];

const measurementData = [
  { measurement: "Waist", "Mar 19": 90, "Jul 19": 85 },
  { measurement: "Chest", "Mar 19": 100, "Jul 19": 102 },
  { measurement: "Hips", "Mar 19": 95, "Jul 19": 94 },
];

const EvolutionTabContent: React.FC<EvolutionTabContentProps> = ({
  photoDates,
  progressPhotos,
  onPhotoClick,
}) => {
  const t = useTranslations();
  const theme = useMantineTheme();

  return (
    <Stack>
      {/* Evolution Charts */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={500}>
            Weight Evolution (kg)
          </Text>
          <LineChart
            h={300}
            data={weightData}
            dataKey="date"
            series={[{ name: "Weight", color: "indigo.6" }]}
            curveType="monotone"
            mt="md"
          />
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={500}>
            Body Measurements (cm)
          </Text>
          <BarChart
            h={300}
            data={measurementData}
            dataKey="measurement"
            series={[
              { name: "Mar 19", color: "cyan.6" },
              { name: "Jul 19", color: "blue.6" },
            ]}
            mt="md"
          />
        </Card>
      </SimpleGrid>

      {/* Progress Photos */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg">
        <Text fw={500}>{t("clientProfile.progress")}</Text>
        <Divider my="sm" />
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
          {photoDates.map((date) => (
            <Box
              key={date}
              onClick={() => onPhotoClick(date)}
              p="xs"
              style={{
                cursor: "pointer",
                textAlign: "center",
                borderRadius: theme.radius.md,
                transition: "background-color 0.2s ease",
              }}
            >
              <Image
                src={progressPhotos[date]?.front}
                alt={`Progress photo from ${date}`}
                height={120}
                fit="cover"
                radius="sm"
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              />
              <Text size="sm" mt="xs">
                {date}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Card>
    </Stack>
  );
};

export default EvolutionTabContent;
