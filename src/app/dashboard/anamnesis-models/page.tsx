"use client";

import React from "react";
import {
  Title,
  Button,
  Container,
  Grid,
  Group,
  Card,
  Text,
  Stack,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function AnamnesisModelsPage() {
  const router = useRouter();
  const t = useTranslations("anamnesisModelsPage");

  const newModel = () => {
    router.push("/dashboard/anamnesis-models/new");
  };

  const loadStandardModel = () => {
    router.push("/dashboard/anamnesis-models/new?loadStandard=true");
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        {t("title")}
      </Title>
      <Grid gutter="md" align="stretch">
        <Grid.Col span={12}>
          <Group align="center" justify="space-between" mb="md">
            <Group />
            <Group gap={12}>
              <Button
                variant="filled"
                color="green"
                leftSection={<IconPlus size={16} />}
                onClick={newModel}
              >
                {t("createButton")}
              </Button>
            </Group>
          </Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: "pointer", height: "100%" }}
            onClick={loadStandardModel}
          >
            <Stack h="100%" justify="space-between">
              <Stack gap="xs">
                <Title order={4}>{t("standardModel.title")}</Title>
                <Text size="sm" c="dimmed">
                  {t("standardModel.description")}
                </Text>
              </Stack>
              <Button variant="light" mt="md">
                {t("standardModel.action")}
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default AnamnesisModelsPage;
