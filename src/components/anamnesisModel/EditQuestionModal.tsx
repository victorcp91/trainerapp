"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Checkbox,
  Button,
  Stack,
  Select,
  Group,
  Text,
  Divider,
  ActionIcon,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  IQuestion,
  IBodyPartsQuestion,
  IMetricQuestion,
  IWelcome,
  ISingleOptionQuestion,
  IMultipleOptionQuestion,
  IDateQuestion,
} from "@/types/QuestionTypes";

// Define a type for the valid question type translation keys
type QuestionTypeTranslationKey =
  `anamnesisModelEditor.questionTypes.${IQuestion["type"]}`;

// Define available body parts and their i18n keys (mirroring standardAnamnesisModel)
// Ideally, this comes from a central constant
const sa = "standardAnamnesis"; // Abbreviation for standardAnamnesis
const AVAILABLE_BODY_PARTS = {
  abs: `${sa}.focusMuscles.abs`,
  back: `${sa}.focusMuscles.back`,
  biceps: `${sa}.focusMuscles.biceps`,
  calves: `${sa}.focusMuscles.calves`, // Combined key
  chest: `${sa}.focusMuscles.chest`,
  forearms: `${sa}.focusMuscles.forearms`,
  glutes: `${sa}.focusMuscles.glutes`,
  neck: `${sa}.focusMuscles.neck`,
  shoulders: `${sa}.focusMuscles.shoulders`,
  thighs: `${sa}.focusMuscles.thighs`, // Combined key
  triceps: `${sa}.focusMuscles.triceps`,
};
const availablePartKeys = Object.keys(AVAILABLE_BODY_PARTS);

interface Option {
  label: string;
  value: string;
}

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (index: number, updatedQuestion: IQuestion) => void;
  question: IQuestion | null;
  questionIndex: number | null;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  question,
  questionIndex,
}) => {
  const t = useTranslations();
  const [formData, setFormData] = useState<Partial<IQuestion>>({});
  const [localOptions, setLocalOptions] = useState<Option[]>([]);

  // Get the master list of body part options from the default model
  // const masterBodyPartOptions = React.useMemo(() => { // No longer needed for rendering
  //   const bodyPartQuestion = defaultAnamnesisModel.find(
  //     (q) => q.type === "bodyParts"
  //   ) as IBodyPartsQuestion | undefined;
  //   return bodyPartQuestion?.options || [];
  // }, []);

  useEffect(() => {
    if (question) {
      // Initialize with the question data
      const initialFormData: Partial<IQuestion> = { ...question };

      // Ensure formData.value is an array ONLY for bodyParts
      if (
        initialFormData.type === "bodyParts" &&
        !Array.isArray(initialFormData.value)
      ) {
        initialFormData.value = [];
      }
      setFormData(initialFormData);

      // Handle options state only for single/multiple
      if (
        question.type === "singleOption" ||
        question.type === "multipleOption"
      ) {
        if (Array.isArray(question.options)) {
          const formattedOptions = question.options.map(
            (opt: string | Option) =>
              typeof opt === "string" ? { label: opt, value: opt } : opt
          );
          setLocalOptions([...formattedOptions]);
        } else {
          setLocalOptions([]);
        }
      } else {
        setLocalOptions([]);
      }
    } else {
      setFormData({});
      setLocalOptions([]);
    }
  }, [question, isOpen]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox
      ? (event.target as HTMLInputElement).checked
      : false;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value || undefined }));
  };

  const handleOptionChange = (
    index: number,
    field: keyof Option,
    value: string
  ) => {
    if (
      question?.type === "singleOption" ||
      question?.type === "multipleOption"
    ) {
      setLocalOptions((prevOptions) =>
        prevOptions.map((opt, i) => {
          if (i === index) {
            if (field === "label") {
              const newValue = value.trim().toLowerCase().replace(/\s+/g, "_");
              return { ...opt, label: value, value: newValue };
            }
          }
          return opt;
        })
      );
    }
  };

  const handleAddOption = () => {
    if (
      question?.type === "singleOption" ||
      question?.type === "multipleOption"
    ) {
      setLocalOptions((prevOptions) => [
        ...prevOptions,
        { label: "", value: "" },
      ]);
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (
      question?.type === "singleOption" ||
      question?.type === "multipleOption"
    ) {
      setLocalOptions((prevOptions) =>
        prevOptions.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  const handleSaveClick = () => {
    if (questionIndex !== null && question && formData) {
      let updatedQuestionData: IQuestion = {
        ...question,
        ...formData,
      } as IQuestion;

      // Only add options if it's single/multiple
      if (
        updatedQuestionData.type === "singleOption" ||
        updatedQuestionData.type === "multipleOption"
      ) {
        const optionsQuestion = updatedQuestionData as
          | ISingleOptionQuestion
          | IMultipleOptionQuestion;
        optionsQuestion.options = localOptions;
        updatedQuestionData = optionsQuestion;
      }

      onSave(questionIndex, updatedQuestionData);
    }
  };

  const renderFormFields = () => {
    if (!question) return <Text>No question selected.</Text>;

    // const isStandard = !!question?.standardKey;
    const isStandard =
      question && "standardKey" in question && !!question.standardKey; // Safely check for standardKey

    // Common fields logic
    const renderCommonFields = (skipDivider?: boolean) => (
      <>
        <TextInput
          label={
            question?.type === "welcome"
              ? t("anamnesisModelEditor.editQuestionModal.welcomeTitleLabel")
              : t("anamnesisModelEditor.editQuestionModal.questionTitle")
          }
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          required
          disabled={isStandard}
        />
        {(question.type === "welcome" || question.type === "date") && (
          <Textarea
            label={t("anamnesisModelEditor.editQuestionModal.description")}
            name="description"
            value={
              (formData as Partial<IWelcome | IDateQuestion>).description || ""
            }
            onChange={handleInputChange}
            // Description always editable
          />
        )}
        {question.type !== "welcome" && question.type !== "bodyParts" && (
          <Checkbox
            label={t("anamnesisModelEditor.editQuestionModal.required")}
            name="required"
            checked={
              (formData as Partial<Exclude<IQuestion, IWelcome>>).required ||
              false
            }
            onChange={handleInputChange}
            // Required status always editable
          />
        )}
        {(question.type === "singleOption" ||
          question.type === "multipleOption") && (
          <Checkbox
            label={t(
              "anamnesisModelEditor.editQuestionModal.allowOtherOptionInput"
            )}
            name="allowOtherOptionInput"
            checked={
              (
                formData as Partial<
                  ISingleOptionQuestion | IMultipleOptionQuestion
                >
              ).allowOtherOptionInput || false
            }
            onChange={handleInputChange}
            mt="xs"
            disabled={isStandard} // Disable for standard
          />
        )}
        {(question.type === "singleOption" ||
          question.type ===
            "multipleOption") /* Removed || question.type === "bodyParts" */ && (
          <Checkbox
            label={t("anamnesisModelEditor.editQuestionModal.allowNoneOption")}
            name="allowNoneOption"
            checked={
              (
                formData as Partial<
                  | ISingleOptionQuestion
                  | IMultipleOptionQuestion
                  | IBodyPartsQuestion
                >
              ).allowNoneOption || false
            }
            onChange={handleInputChange}
            mt="xs"
            disabled={isStandard} // Disable for standard
          />
        )}
        {!skipDivider && <Divider my="sm" />}{" "}
        {/* Conditionally render divider */}
      </>
    );

    switch (question.type) {
      case "welcome": {
        const welcomeFormData = formData as Partial<IWelcome>;
        return (
          <Stack>
            {renderCommonFields()}
            <TextInput
              label={t("anamnesisModelEditor.editQuestionModal.trainerName")}
              name="trainerName"
              value={welcomeFormData.trainerName || ""}
              onChange={handleInputChange}
              required
            />
            <TextInput
              label={t(
                "anamnesisModelEditor.editQuestionModal.trainerImageUrl"
              )}
              name="trainerImage"
              value={welcomeFormData.trainerImage || ""}
              onChange={handleInputChange}
            />
            <TextInput
              label={t("anamnesisModelEditor.editQuestionModal.buttonText")}
              name="buttonText"
              value={welcomeFormData.buttonText || ""}
              onChange={handleInputChange}
              required
            />
          </Stack>
        );
      }
      case "text":
      case "date":
        // Only common fields apply
        return <Stack>{renderCommonFields()}</Stack>;

      case "singleOption":
      case "multipleOption": {
        return (
          <Stack>
            {renderCommonFields()}
            <Text size="sm" fw={500} mb="xs">
              {t("anamnesisModelEditor.editQuestionModal.options")}
            </Text>
            <Stack gap="xs">
              {localOptions.map((option, index) => (
                <Group key={index} wrap="nowrap" gap="xs">
                  <TextInput // Option Label
                    placeholder={t(
                      "anamnesisModelEditor.editQuestionModal.optionLabelPlaceholder"
                    )}
                    value={option.label}
                    onChange={(e) => {
                      handleOptionChange(index, "label", e.target.value);
                    }}
                    style={{ flex: 1 }}
                    disabled={isStandard}
                  />
                  <ActionIcon // Remove Option
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveOption(index)}
                    disabled={localOptions.length <= 1 || isStandard} // Keep this combined logic
                    title={t(
                      "anamnesisModelEditor.editQuestionModal.removeOption",
                      { index: index + 1 }
                    )}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
            <Button // Add Option
              leftSection={<IconPlus size={16} />}
              onClick={handleAddOption}
              variant="light"
              mt="md"
              size="xs"
              disabled={isStandard} // ADDED
            >
              {t("anamnesisModelEditor.editQuestionModal.addOption")}
            </Button>
          </Stack>
        );
      }
      case "bodyParts": {
        return (
          <Stack>
            {renderCommonFields(true)}
            <Stack mt="md">
              <Divider
                label={t("anamnesisModelEditor.editQuestionModal.options")}
              />
              <Text size="xs" c="dimmed" mt="xs">
                {t("anamnesisModelEditor.editQuestionModal.bodyPartsInfo")}
              </Text>
              {/* Display options like multipleOption but disabled */}
              <Stack gap="xs" mt="xs">
                {availablePartKeys.map((partKey) => (
                  <Group key={partKey} wrap="nowrap" gap="xs">
                    <TextInput
                      value={t(
                        AVAILABLE_BODY_PARTS[
                          partKey as keyof typeof AVAILABLE_BODY_PARTS
                        ]
                      )} // Use translated label
                      style={{ flex: 1 }}
                      disabled // Display as read-only
                    />
                    {/* No Add/Remove buttons for bodyParts */}
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Stack>
        );
      }
      case "metric": {
        const metricFormData = formData as Partial<IMetricQuestion>;
        return (
          <Stack>
            {renderCommonFields()}
            <Select // Metric Unit
              label={t("anamnesisModelEditor.editQuestionModal.metric")}
              name="metric"
              data={["kg", "g", "mg", "cm", "mm", "l", "ml", "%", "lb", "oz"]}
              value={metricFormData.metric || ""}
              onChange={(value) => handleSelectChange("metric", value || "")}
              required
              disabled={isStandard} // ADDED
            />
          </Stack>
        );
      }
      default:
        // Fallback for any unexpected type
        return <Stack>{renderCommonFields()}</Stack>;
    }
  };

  if (!question) return null;

  // Get the translated name for the current question type
  const translatedQuestionType = t(
    `anamnesisModelEditor.questionTypes.${question.type}` as QuestionTypeTranslationKey
  );

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("anamnesisModelEditor.editQuestionModal.title", {
        translatedType: translatedQuestionType, // Pass the translated type
      })}
      size="lg"
    >
      <Stack>
        {renderFormFields()}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveClick}>{t("common.save")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditQuestionModal;
