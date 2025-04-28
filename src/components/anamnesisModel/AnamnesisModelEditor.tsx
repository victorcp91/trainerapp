"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
  Divider,
} from "@mantine/core";
import {
  IconTextPlus,
  IconCalendar,
  IconListNumbers,
  IconRulerMeasure,
  IconAccessible,
  IconListCheck,
  IconActivityHeartbeat,
  IconTemplate,
  IconTargetArrow,
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
import defaultAnamnesisModel from "@/constants/defaultAnamnesisModel";
import {
  IQuestion,
  StandardQuestionKey,
  IWelcome,
} from "@/types/QuestionTypes";
import SortableQuestionItem from "./SortableQuestionItem";
import EditQuestionModal from "./EditQuestionModal";

interface AnamnesisModelEditorProps {
  initialQuestions?: IQuestion[];
  onSave: (questions: IQuestion[]) => void;
  onLoadStandard: () => void;
  mode: "new" | "create_from_standard" | "edit";
  onDelete?: () => void;
}

// Define the standard welcome question constant (used for initialization)
// Use keys from standardAnamnesisModel for consistency
const sa_key = "standardAnamnesis"; // Match the prefix used in standardAnamnesisModel.ts
const WELCOME_QUESTION_DEFAULTS: Partial<IQuestion> & { type: "welcome" } = {
  type: "welcome",
  title: `${sa_key}.welcome.title`,
  description: `${sa_key}.welcome.description`,
  trainerName: "", // Default to empty string
  trainerImage: "", // Default to empty string, not a key
  buttonText: `${sa_key}.welcome.buttonText`,
  required: false,
};

// --- Helper Function --- Moved Outside Component ---
const getTranslatedValue = (
  currentValue: string | undefined | null,
  defaultKey: string | undefined,
  tFunc: (key: string) => string // Pass translation function
): string => {
  // Determine if translation is needed
  const needsTranslation = !currentValue || currentValue === defaultKey;

  if (needsTranslation) {
    // Only translate if the defaultKey is a valid, non-empty string
    return defaultKey ? tFunc(defaultKey) : "";
  }

  // Otherwise, return the existing value (already translated or non-key)
  return currentValue ?? "";
};

const AnamnesisModelEditor: React.FC<AnamnesisModelEditorProps> = ({
  initialQuestions = [],
  onSave,
  onLoadStandard,
  mode,
  onDelete,
}): React.JSX.Element | null => {
  const t = useTranslations("anamnesisModelEditor");
  const tRoot = useTranslations();

  const [internalQuestions, setInternalQuestions] =
    useState<IQuestion[]>(initialQuestions);

  // Map standard keys to icons (can be defined here)
  const standardQuestionIcons: Record<StandardQuestionKey, React.ElementType> =
    {
      birthDate: IconCalendar,
      gender: IconListNumbers,
      height: IconRulerMeasure,
      weight: IconRulerMeasure,
      trainingDays: IconListCheck,
      primaryGoal: IconTextPlus,
      experienceLevel: IconListNumbers,
      sessionTime: IconCalendar,
      trainingLocation: IconAccessible,
      equipmentAccess: IconListCheck,
      orthopedicLimitations: IconActivityHeartbeat,
      cardioTypes: IconActivityHeartbeat,
    };

  const [isDirty, setIsDirty] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);

  // Determine if the 'Load Standard Model' button should be shown
  // Only show it when creating a completely new model from scratch
  const showLoadStandardButton = mode === "new";

  // --- Translate Welcome Function --- Uses Helper ---
  const translateWelcome = React.useCallback(
    (q: IWelcome): IWelcome => {
      return {
        ...q,
        title: getTranslatedValue(
          q.title,
          WELCOME_QUESTION_DEFAULTS.title,
          tRoot
        ),
        description: getTranslatedValue(
          q.description,
          WELCOME_QUESTION_DEFAULTS.description,
          tRoot
        ),
        trainerName: getTranslatedValue(
          q.trainerName,
          WELCOME_QUESTION_DEFAULTS.trainerName,
          tRoot
        ),
        buttonText: getTranslatedValue(
          q.buttonText,
          WELCOME_QUESTION_DEFAULTS.buttonText,
          tRoot
        ),
        trainerImage:
          q.trainerImage ?? WELCOME_QUESTION_DEFAULTS.trainerImage ?? "",
      };
    },
    [tRoot]
  );

  useEffect(() => {
    const processedQuestions = initialQuestions ? [...initialQuestions] : [];

    // Ensure Welcome question is first and has order 0
    if (
      processedQuestions.length === 0 ||
      processedQuestions[0].type !== "welcome"
    ) {
      // Prepend a default welcome question if missing
      const defaultWelcome: IWelcome = {
        ...(WELCOME_QUESTION_DEFAULTS as IWelcome), // Cast to IWelcome
        order: 0,
      };
      // Translate the default fields
      const translatedDefaultWelcome = translateWelcome(defaultWelcome);
      processedQuestions.unshift(translatedDefaultWelcome);
    } else {
      // Ensure existing welcome question has order 0 and is translated
      processedQuestions[0] = {
        ...translateWelcome(processedQuestions[0] as IWelcome),
        order: 0,
      };
    }

    // Re-index all subsequent questions
    const finalInitialQuestions = processedQuestions.map((q, index) => ({
      ...q,
      order: index,
    }));

    setInternalQuestions(JSON.parse(JSON.stringify(finalInitialQuestions)));
    setIsDirty(false);
  }, [initialQuestions, tRoot, translateWelcome]);

  // Define available custom types (needed by getQuestionTypeIcon)
  const availableQuestionTypes = [
    { type: "text", icon: IconTextPlus, label: t("questionTypes.text") },
    { type: "date", icon: IconCalendar, label: t("questionTypes.date") },
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
      icon: IconTargetArrow,
      label: t("questionTypes.bodyParts"),
    },
  ];

  // MOVED getQuestionTypeIcon function definition earlier
  const getQuestionTypeIcon = (type: string): React.ElementType => {
    // Check custom types first
    const custom = availableQuestionTypes.find((it) => it.type === type);
    if (custom) return custom.icon;

    // Fallback: Check standard types via the map
    const standardIconKey = Object.keys(standardQuestionIcons).find((key) => {
      const stdKey = key as StandardQuestionKey;
      const defaultQuestion = defaultAnamnesisModel.find(
        (q): q is IQuestion & { standardKey: StandardQuestionKey } =>
          typeof q === "object" &&
          q !== null &&
          "standardKey" in q &&
          (q as { standardKey?: string }).standardKey === stdKey
      );
      return defaultQuestion?.type === type;
    });
    if (standardIconKey) {
      return standardQuestionIcons[standardIconKey as StandardQuestionKey];
    }

    return IconTemplate; // Default icon
  };

  // Define standardQuestionTemplates *after* getQuestionTypeIcon
  const standardQuestionTemplates = defaultAnamnesisModel
    .filter(
      (q): q is IQuestion & { standardKey: StandardQuestionKey } =>
        typeof q === "object" &&
        q !== null &&
        "standardKey" in q &&
        (q as { standardKey?: string }).standardKey !== "welcome"
    )
    .map((q) => ({
      key: q.standardKey,
      label: tRoot(q.title),
      icon: getQuestionTypeIcon(q.type), // Now function is defined
    }));

  // Handles adding both standard templates and generic custom types
  const handleAddQuestion = (itemKey: string) => {
    // Prevent adding welcome question manually
    if (itemKey === "welcome") return;

    const standardTemplate = defaultAnamnesisModel.find(
      (q) =>
        typeof q === "object" &&
        q !== null &&
        "standardKey" in q &&
        (q as { standardKey?: string }).standardKey === itemKey
    );

    let newQuestion: IQuestion;

    if (standardTemplate) {
      // Use const since we modify properties, not reassign the variable
      const newQuestion = JSON.parse(JSON.stringify(standardTemplate));
      newQuestion.order = internalQuestions.length;

      // --- Translate the copied standard question --- START
      if (newQuestion.title) {
        newQuestion.title = tRoot(newQuestion.title);
      }
      // Use type guard for description
      if ("description" in newQuestion && newQuestion.description) {
        newQuestion.description = tRoot(newQuestion.description);
      }
      if (newQuestion.type === "welcome") {
        // Welcome type has these fields guaranteed by its interface
        if (newQuestion.buttonText)
          newQuestion.buttonText = tRoot(newQuestion.buttonText);
        if (newQuestion.trainerName)
          newQuestion.trainerName = tRoot(newQuestion.trainerName);
      }
      // Use type guard for options
      if ("options" in newQuestion && Array.isArray(newQuestion.options)) {
        // Handle options array with better typing
        newQuestion.options = newQuestion.options.map(
          (opt: string | { label: string; value: string }) => {
            if (typeof opt === "string") {
              // Case for simple string options (e.g., old injury format - likely obsolete)
              return tRoot(opt);
            } else if (opt && typeof opt === "object" && opt.label) {
              // Case for {label, value} options
              return { ...opt, label: tRoot(opt.label) };
            }
            return opt; // Fallback
          }
        );
      }
      // --- Translate the copied standard question --- END

      setInternalQuestions((currentQuestions) => [
        ...currentQuestions,
        newQuestion,
      ]);
      setIsDirty(true);
      return;
    } else if (isValidQuestionType(itemKey)) {
      // Adding a generic custom question type
      const type = itemKey; // It's a valid generic type

      // --- Existing logic for creating generic questions --- START
      const template = defaultAnamnesisModel.find((q) => q.type === type);
      const questionTypeDetails = availableQuestionTypes.find(
        (qt) => qt.type === type
      );
      const translatedLabel = questionTypeDetails
        ? questionTypeDetails.label
        : type;

      // Ensure defaultitle is always a string
      const defaultitle =
        type === "welcome"
          ? translatedLabel ?? t("questionDefaults.welcome.title") // Provide fallback for welcome
          : `${t("newQuestionPrefix")} (${
              translatedLabel ?? t("unknownType")
            })`; // Provide fallback for others

      const baseProps = {
        title: defaultitle, // Now guaranteed to be a string
        required: false,
        order: internalQuestions.length,
      };

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
              template && "trainerImage" in template
                ? template.trainerImage
                : "",
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
          newQuestion = {
            ...baseProps,
            type: "metric",
            metric: "kg",
            value: 0,
          };
          break;
        case "bodyParts":
          newQuestion = {
            ...baseProps,
            type: "bodyParts",
            value: [],
            title: tRoot("standardAnamnesis.focusMuscles.title"),
          };
          break;
        default:
          // This case should not be reached if itemKey is a valid type
          console.error("Unhandled question type in handleAddQuestion:", type);
          return;
      }
      // --- Existing logic for creating generic questions --- END
    } else {
      // The itemKey is neither a standardKey nor a valid generic type
      console.error("Invalid item key for adding question:", itemKey);
      return;
    }

    setInternalQuestions((currentQuestions) => {
      const updatedQuestions = [...currentQuestions, newQuestion];
      // Re-index everything after adding
      return updatedQuestions.map((q, index) => ({ ...q, order: index }));
    });
    setIsDirty(true);
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    // Prevent removing the welcome question
    if (indexToRemove === 0) return;

    setInternalQuestions((currentQuestions) =>
      currentQuestions
        .filter((_, index) => index !== indexToRemove)
        // Re-index remaining questions
        .map((q, index) => ({ ...q, order: index }))
    );
    setIsDirty(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Prevent dragging welcome question or dropping onto its position
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);
      if (oldIndex === 0 || newIndex === 0) {
        return; // Don't allow interaction with the fixed welcome question
      }

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
        // Re-index everything after moving
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

  const isValidQuestionType = (type: string): type is IQuestion["type"] => {
    const validTypesFromSidebar = availableQuestionTypes.map((qt) => qt.type);
    return validTypesFromSidebar.includes(type);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Container size="lg" py="xl">
        <Grid>
          {/* Left Content: Question List (Moved from right) */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack>
              {/* Header: Title and Buttons */}
              <Flex justify="space-between" align="center" mb="md">
                <Title order={2} mb="lg">
                  {mode === "edit"
                    ? t("pageTitleEdit")
                    : mode === "create_from_standard"
                    ? tRoot("anamnesisModelsPage.standardModel.title")
                    : t("standardModelTitle")}
                </Title>
                <Group>
                  {showLoadStandardButton && (
                    <Button
                      variant="outline"
                      leftSection={<IconTemplate size={16} />}
                      onClick={onLoadStandard}
                    >
                      {t("loadStandardTemplate")}
                    </Button>
                  )}
                  {mode === "edit" && onDelete && (
                    <Button
                      variant="outline"
                      color="red"
                      onClick={onDelete}
                      mr="auto"
                    >
                      {tRoot("common.delete")}
                    </Button>
                  )}
                  <Button
                    onClick={() => onSave(internalQuestions)}
                    color="green"
                    disabled={!isDirty}
                  >
                    {t("saveButton")}
                  </Button>
                </Group>
              </Flex>

              {/* Sortable Question List Area */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={internalQuestions.slice(1).map((q) => q.order)}
                  strategy={verticalListSortingStrategy}
                >
                  <Stack gap="sm">
                    {internalQuestions.map((question, index) => {
                      // REMOVED icon determination logic

                      return (
                        <SortableQuestionItem
                          key={index}
                          question={question}
                          index={index}
                          onEdit={() => handleEditQuestion(index)}
                          onRemove={() => handleRemoveQuestion(index)}
                          getQuestionTypeIcon={getQuestionTypeIcon}
                          isFixed={index === 0}
                          t={tRoot}
                        />
                      );
                    })}
                  </Stack>
                </SortableContext>
              </DndContext>
              {internalQuestions.length === 0 && (
                <Card withBorder p="xl" radius="md">
                  <Text ta="center">{t("noQuestionsPrompt")}</Text>
                </Card>
              )}
            </Stack>
          </Grid.Col>

          {/* Right Sidebar: Add Question Types (Moved from left) */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card withBorder p="md" radius="md">
              <Title order={4} mb="sm">
                {t("addQuestionTitle")}
              </Title>
              <Stack gap="xs">
                {/* MOVED Custom Questions Section First */}
                <Title order={6} my="xs">
                  {t("customQuestionsHeader")}
                </Title>
                <Stack gap="xs">
                  {/* Filter out welcome type from addable custom types */}
                  {availableQuestionTypes
                    .filter((item) => item.type !== "welcome")
                    .map((item) => (
                      <Card
                        key={item.type}
                        onClick={() => handleAddQuestion(item.type)}
                        style={{ cursor: "pointer" }}
                        p="xs"
                      >
                        <Flex align="flex-start">
                          <item.icon size={20} style={{ marginRight: 8 }} />
                          <Text size="sm">{item.label}</Text>
                        </Flex>
                      </Card>
                    ))}
                </Stack>

                <Divider my="sm" />

                {/* MOVED Standard Questions Section Second */}
                <Title order={6} my="xs">
                  {t("standardQuestionsHeader")}
                </Title>
                <Stack gap="xs">
                  {standardQuestionTemplates.map((item) => (
                    <Card
                      key={item.key}
                      onClick={() => handleAddQuestion(item.key)}
                      style={{ cursor: "pointer" }}
                      p="xs"
                    >
                      <Flex align="flex-start">
                        <item.icon size={20} style={{ marginRight: 8 }} />
                        <Text size="sm">{item.label}</Text>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Edit Question Modal (Remains unchanged) */}
      {editingQuestionIndex !== null && (
        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          question={internalQuestions[editingQuestionIndex]}
          questionIndex={editingQuestionIndex}
          onSave={handleSaveEdit}
        />
      )}
    </DndContext>
  );
};

export default AnamnesisModelEditor;
