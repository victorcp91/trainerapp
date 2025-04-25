"use client";

import React, { useState } from "react";
import {
  Title,
  Button,
  Container,
  Grid,
  Group,
  Card,
  Text,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import sampleAnamnesisModels, {
  ISavedAnamnesisModel,
} from "@/app/constants/sampleAnamnesisModels";

function AnamnesisModelsPage() {
  const router = useRouter();
  const t = useTranslations("anamnesisModelsPage");

  const [createdModels, setCreatedModels] = useState<ISavedAnamnesisModel[]>(
    sampleAnamnesisModels
  );

  const newModel = () => {
    router.push("/dashboard/anamnesis-models/new");
  };

  const loadStandardModel = () => {
    router.push("/dashboard/anamnesis-models/new?loadStandard=true");
  };

  const handleDelete = (event: React.MouseEvent, modelId: string) => {
    event.stopPropagation();
    event.preventDefault();

    if (window.confirm(`Are you sure you want to delete model ${modelId}?`)) {
      console.log(`Deleting model ${modelId}...`);
      setCreatedModels((prevModels) =>
        prevModels.filter((model) => model.id !== modelId)
      );
    }
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>{t("title")}</Title>
        <Button
          variant="filled"
          color="green"
          leftSection={<IconPlus size={16} />}
          onClick={newModel}
        >
          {t("createButton")}
        </Button>
      </Group>

      <Grid gutter="md" align="stretch">
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

        {createdModels.map((model) => (
          <Grid.Col key={model.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ height: "100%", position: "relative" }}
              component={Link}
              href={`/dashboard/anamnesis-models/${model.id}`}
            >
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={(e) => handleDelete(e, model.id)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  zIndex: 1,
                }}
                aria-label={`Delete model ${model.name}`}
              >
                <IconTrash size={16} />
              </ActionIcon>

              <Stack h="100%" justify="space-between">
                <Stack gap="xs">
                  <Title order={4}>{model.name}</Title>
                  <Text size="sm" c="dimmed">
                    {model.description}
                  </Text>
                </Stack>
                <Button
                  variant="outline"
                  mt="md"
                  leftSection={<IconEdit size={16} />}
                >
                  {t("editButton")}
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default AnamnesisModelsPage;
