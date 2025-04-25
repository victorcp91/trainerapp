"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Flex,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import {
  IconTextPlus,
  IconCalendar,
  IconListNumbers,
  IconRulerMeasure,
  IconAccessible,
  IconHandStop,
  IconListCheck,
  IconActivityHeartbeat,
  IconTemplate,
} from "@tabler/icons-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  PointerSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import defaultAnamnesisModel from "@/app/constants/defaulttAnamnesisModel";
import { IQuestion } from "@/types/QuestionTypes";
import SortableQuestionItem from "./SortableQuestionItem";
import EditQuestionModal from "./EditQuestionModal";

interface AnamnesisModelEditorProps {
  initialQuestions?: IQuestion[];
  onSave: (questions: IQuestion[]) => void;
  onLoadStandard: () => void;
  mode: "new" | "create_from_standard";
}

const AnamnesisModelEditor: React.FC<AnamnesisModelEditorProps> = ({
  initialQuestions = [],
  onSave,
  onLoadStandard,
  mode,
}) => {
  const t = useTranslations("anamnesisModelEditor");
  const tRoot = useTranslations();

  const [internalQuestions, setInternalQuestions] =
    useState<IQuestion[]>(initialQuestions);

  const [isDirty, setIsDirty] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    setInternalQuestions(JSON.parse(JSON.stringify(initialQuestions)));
    setIsDirty(false);
  }, [initialQuestions]);

  const availableQuestionTypes = [
    {
      type: "welcome",
      icon: IconHandStop,
      label: t("questionTypes.welcome"),
    },
    {
      type: "text",
      icon: IconTextPlus,
      label: t("questionTypes.text"),
    },
    {
      type: "date",
      icon: IconCalendar,
      label: t("questionTypes.date"),
    },
    {
      type: "singleOption",
      icon: IconListNumbers,
      label: t("questionTypes.singleOption"),
    },
    {
      type: "multipleOption",
      icon: IconListCheck,
      label: t("questionTypes.multipleOption"),
    },
    {
      type: "metric",
      icon: IconRulerMeasure,
      label: t("questionTypes.metric"),
    },
    {
      type: "bodyParts",
      icon: IconAccessible,
      label: t("questionTypes.bodyParts"),
    },
    {
      type: "injury",
      icon: IconActivityHeartbeat,
      label: t("questionTypes.injury"),
    },
  ];

  const getQuestionTypeIcon = (type: string) => {
    const questionType = availableQuestionTypes.find((qt) => qt.type === type);
    return questionType ? questionType.icon : IconTextPlus;
  };

  const isValidQuestionType = (type: string): type is IQuestion["type"] => {
    const validTypesFromSidebar = availableQuestionTypes.map((qt) => qt.type);
    return validTypesFromSidebar.includes(type);
  };

  const handleAddQuestion = (type: string) => {
    if (!isValidQuestionType(type)) {
      console.error("Invalid question type:", type);
      return;
    }

    const template = defaultAnamnesisModel.find((q) => q.type === type);
    const questionTypeDetails = availableQuestionTypes.find(
      (qt) => qt.type === type
    );
    const translatedLabel = questionTypeDetails
      ? questionTypeDetails.label
      : type;

    const defaultTitle =
      type === "welcome"
        ? translatedLabel
        : `${t("newQuestionPrefix")} (${translatedLabel})`;

    const baseProps = {
      title: defaultTitle,
      required: false,
      order: internalQuestions.length,
    };

    let newQuestion: IQuestion;

    switch (type) {
      case "welcome":
        newQuestion = {
          ...baseProps,
          type: "welcome",
          buttonText:
            template && "buttonText" in template
              ? template.buttonText
              : t("questionDefaults.welcome.buttonText"),
          trainerName:
            template && "trainerName" in template
              ? template.trainerName
              : "Trainer",
          trainerImage:
            template && "trainerImage" in template ? template.trainerImage : "",
          description:
            template && "description" in template ? template.description : "",
        };
        break;
      case "text":
        newQuestion = { ...baseProps, type: "text", value: "" };
        break;
      case "date":
        newQuestion = {
          ...baseProps,
          type: "date",
          value: null,
          description:
            template && "description" in template
              ? template.description
              : undefined,
        };
        break;
      case "singleOption":
        newQuestion = {
          ...baseProps,
          type: "singleOption",
          options: [],
          value: "",
        };
        break;
      case "multipleOption":
        newQuestion = {
          ...baseProps,
          type: "multipleOption",
          options: [],
          value: [],
        };
        break;
      case "metric":
        newQuestion = { ...baseProps, type: "metric", metric: "kg", value: 0 };
        break;
      case "bodyParts":
        const defaultBodyPartsQuestion = defaultAnamnesisModel.find(
          (q) => q.type === "bodyParts"
        );
        const defaultOptions =
          defaultBodyPartsQuestion && "options" in defaultBodyPartsQuestion
            ? defaultBodyPartsQuestion.options
            : [];
        const initialOptions = defaultOptions.filter(
          (opt) => opt.value !== "neck"
        );

        newQuestion = {
          ...baseProps,
          type: "bodyParts",
          options: initialOptions,
          value: [],
        };
        break;
      case "injury":
        newQuestion = {
          ...baseProps,
          type: "injury",
          trainerName:
            template && "trainerName" in template
              ? template.trainerName
              : "Trainer",
          value: "",
        };
        break;
      default:
        console.error("Unhandled question type in handleAddQuestion:", type);
        return;
    }

    setInternalQuestions((currentQuestions) => [
      ...currentQuestions,
      newQuestion,
    ]);
    setIsDirty(true);
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    setInternalQuestions((currentQuestions) =>
      currentQuestions
        .filter((_, index) => index !== indexToRemove)
        .map((q, index) => ({ ...q, order: index }))
    );
    setIsDirty(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      if (
        oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= internalQuestions.length ||
        newIndex >= internalQuestions.length
      ) {
        console.error("Invalid index for drag event:", oldIndex, newIndex);
        return;
      }

      setInternalQuestions((items: IQuestion[]) => {
        const movedItems = arrayMove(items, oldIndex, newIndex);
        const updatedOrder = movedItems.map((item, index) => ({
          ...item,
          order: index,
        }));
        setIsDirty(true);
        return updatedOrder;
      });
    }
  };

  const handleEditQuestion = (indexToEdit: number) => {
    setEditingQuestionIndex(indexToEdit);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingQuestionIndex(null);
  };

  const handleSaveEdit = (index: number, updatedQuestion: IQuestion) => {
    setInternalQuestions((currentQuestions: IQuestion[]) =>
      currentQuestions.map((q: IQuestion, i: number) =>
        i === index ? updatedQuestion : q
      )
    );
    setIsDirty(true);
    handleCloseEditModal();
  };

  const saveButtonText =
    mode === "create_from_standard"
      ? tRoot("common.createModel")
      : tRoot("common.saveModel");

  const showSaveButton =
    mode === "new" || (mode === "create_from_standard" && isDirty);

  return (
    <Container size="xl" py="xl">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2} mb="lg">
          {t("titleNew")}
        </Title>
        <Group>
          <Button
            variant="outline"
            leftSection={<IconTemplate size={16} />}
            onClick={onLoadStandard}
          >
            {t("loadStandardTemplate")}
          </Button>
          {showSaveButton && (
            <Button onClick={() => onSave(internalQuestions)} color="green">
              {saveButtonText}
            </Button>
          )}
        </Group>
      </Flex>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={internalQuestions.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="sm">
                {internalQuestions.map((question, index) => (
                  <SortableQuestionItem
                    key={index}
                    index={index}
                    question={question}
                    onEdit={() => handleEditQuestion(index)}
                    onRemove={() => handleRemoveQuestion(index)}
                    getQuestionTypeIcon={getQuestionTypeIcon}
                    t={tRoot}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          {internalQuestions.length === 0 && (
            <Card withBorder p="xl" radius="md">
              <Text ta="center">{t("noQuestionsPrompt")}</Text>
            </Card>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="md" radius="md">
            <Title order={4} mb="sm">
              {t("addQuestionTitle")}
            </Title>
            <Stack gap="xs">
              {availableQuestionTypes.map((qType) => (
                <Button
                  key={qType.type}
                  variant="outline"
                  leftSection={<qType.icon size={16} />}
                  onClick={() => handleAddQuestion(qType.type)}
                  fullWidth
                  justify="start"
                >
                  {qType.label}
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
      {editingQuestionIndex !== null && (
        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          question={internalQuestions[editingQuestionIndex]}
          questionIndex={editingQuestionIndex}
          onSave={handleSaveEdit}
        />
      )}
    </Container>
  );
};

export default AnamnesisModelEditor;
