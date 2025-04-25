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
  MultiSelect,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  IQuestion,
  IBodyPartsQuestion,
  IInjuryQuestion,
  IMetricQuestion,
  IWelcome,
  ISingleOptionQuestion,
  IMultipleOptionQuestion,
  IDateQuestion,
} from "@/types/QuestionTypes";
import defaultAnamnesisModel from "@/app/constants/defaulttAnamnesisModel";

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
  const masterBodyPartOptions = React.useMemo(() => {
    const bodyPartQuestion = defaultAnamnesisModel.find(
      (q) => q.type === "bodyParts"
    ) as IBodyPartsQuestion | undefined;
    return bodyPartQuestion?.options || [];
  }, []);

  useEffect(() => {
    if (question) {
      setFormData({ ...question });
      if ("options" in question && Array.isArray(question.options)) {
        setLocalOptions([...question.options]);
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

      if (
        updatedQuestionData.type === "singleOption" ||
        updatedQuestionData.type === "multipleOption" ||
        updatedQuestionData.type === "bodyParts"
      ) {
        const optionsQuestion = updatedQuestionData as
          | ISingleOptionQuestion
          | IMultipleOptionQuestion
          | IBodyPartsQuestion;
        optionsQuestion.options = localOptions;
        updatedQuestionData = optionsQuestion;
      }

      onSave(questionIndex, updatedQuestionData);
    }
  };

  const hasDescription = (
    q: IQuestion | null
  ): q is IWelcome | IDateQuestion => {
    return q?.type === "welcome" || q?.type === "date";
  };

  const isRequiredApplicable = (
    q: IQuestion | null
  ): q is Exclude<IQuestion, IWelcome> => {
    return q?.type !== "welcome";
  };

  const renderFormFields = () => {
    if (!question) return <Text>No question selected.</Text>;

    const showDescription = hasDescription(question);
    const showRequired = isRequiredApplicable(question);

    const commonFields = (
      <>
        <TextInput
          label={t("anamnesisModelEditor.editQuestionModal.questionTitle")}
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          required
        />
        {showDescription && (
          <Textarea
            label={t("anamnesisModelEditor.editQuestionModal.description")}
            name="description"
            value={
              (formData as Partial<IWelcome | IDateQuestion>).description || ""
            }
            onChange={handleInputChange}
          />
        )}
        {showRequired && (
          <Checkbox
            label={t("anamnesisModelEditor.editQuestionModal.required")}
            name="required"
            checked={
              (formData as Partial<Exclude<IQuestion, IWelcome>>).required ||
              false
            }
            onChange={handleInputChange}
          />
        )}
        {/* Checkbox for allowing 'Other' text input */}
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
            mt="xs" // Add some top margin
          />
        )}
        <Divider my="sm" />
      </>
    );

    switch (question.type) {
      case "welcome": {
        const welcomeFormData = formData as Partial<IWelcome>;
        return (
          <>
            <TextInput
              label={t("anamnesisModelEditor.editQuestionModal.title")}
              name="title"
              value={welcomeFormData.title || ""}
              onChange={handleInputChange}
              required
            />
            <Textarea
              label={t("anamnesisModelEditor.editQuestionModal.description")}
              name="description"
              value={welcomeFormData.description || ""}
              onChange={handleInputChange}
            />
            <Divider my="sm" />
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
          </>
        );
      }
      case "text":
        return commonFields;
      case "date":
        return commonFields;
      case "singleOption":
      case "multipleOption": {
        return (
          <>
            {commonFields}
            <Text size="sm" fw={500} mb="xs">
              {t("anamnesisModelEditor.editQuestionModal.options")}
            </Text>
            <Stack gap="xs">
              {localOptions.map((option, index) => (
                <Group key={index} wrap="nowrap" gap="xs">
                  <TextInput
                    placeholder={t(
                      "anamnesisModelEditor.editQuestionModal.optionLabelPlaceholder"
                    )}
                    value={t(option.label)}
                    onChange={(e) => {
                      handleOptionChange(index, "label", e.target.value);
                    }}
                    style={{ flex: 1 }}
                  />
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveOption(index)}
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
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleAddOption}
              variant="light"
              mt="md"
              size="xs"
            >
              {t("anamnesisModelEditor.editQuestionModal.addOption")}
            </Button>
          </>
        );
      }
      case "bodyParts": {
        const handleBodyPartsChange = (selectedValues: string[]) => {
          const newOptions = masterBodyPartOptions.filter((opt) =>
            selectedValues.includes(opt.value)
          );
          setLocalOptions(newOptions);
        };

        return (
          <Stack>
            {commonFields}
            <MultiSelect
              label={t(
                "anamnesisModelEditor.editQuestionModal.bodyPartsSelectLabel",
                { default: "Available Body Parts for this Question" }
              )}
              placeholder={t(
                "anamnesisModelEditor.editQuestionModal.bodyPartsSelectPlaceholder",
                { default: "Select body parts..." }
              )}
              data={masterBodyPartOptions.map((opt) => ({
                label: t(opt.label),
                value: opt.value,
              }))}
              value={localOptions.map((opt) => opt.value)}
              onChange={handleBodyPartsChange}
              searchable
              clearable
            />
          </Stack>
        );
      }
      case "metric": {
        const metricFormData = formData as Partial<IMetricQuestion>;
        return (
          <>
            {commonFields}
            <Select
              label={t("anamnesisModelEditor.editQuestionModal.metric")}
              name="metric"
              data={["kg", "g", "mg", "cm", "mm", "l", "ml", "%", "lb", "oz"]}
              value={metricFormData.metric || ""}
              onChange={(value) => handleSelectChange("metric", value || "")}
              required
            />
          </>
        );
      }
      case "injury": {
        const injuryFormData = formData as Partial<IInjuryQuestion>;
        return (
          <>
            {commonFields}
            <TextInput
              label={t("anamnesisModelEditor.editQuestionModal.trainerName")}
              name="trainerName"
              value={injuryFormData.trainerName || ""}
              onChange={handleInputChange}
              required={!!injuryFormData.required}
            />
          </>
        );
      }
      default:
        return <Text>Tipo de pergunta não suportado para edição.</Text>;
    }
  };

  if (!question) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("anamnesisModelEditor.editQuestionModal.title", {
        type: question.type,
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
