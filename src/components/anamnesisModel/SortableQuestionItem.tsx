"use client";

import React from "react";
import { Card, Flex, Text, Button, Group } from "@mantine/core";
import { IconTrash, IconGripVertical, IconEdit } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IQuestion } from "@/types/QuestionTypes";

interface SortableQuestionItemProps {
  index: number;
  question: IQuestion;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  getQuestionTypeIcon: (type: string) => React.ElementType;
  isFixed?: boolean;
  t: (key: string) => string;
}

const SortableQuestionItem: React.FC<SortableQuestionItemProps> = ({
  index,
  question,
  onRemove,
  onEdit,
  getQuestionTypeIcon,
  isFixed,
  t,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: index });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : "auto",
  };

  const Icon = getQuestionTypeIcon(question.type);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Flex align="center" justify="space-between">
          {!isFixed && (
            <Group gap="xs" {...listeners} style={{ cursor: "grab" }}>
              <IconGripVertical size={20} color="gray" />
            </Group>
          )}
          {isFixed && <div style={{ width: 20 }} />}

          <Flex
            align="center"
            style={{ flexGrow: 1, marginLeft: "10px", marginRight: "10px" }}
          >
            <Icon size={20} style={{ marginRight: "8px", flexShrink: 0 }} />
            <Text fw={500} truncate>
              {" "}
              {question.title.includes(".")
                ? t(question.title)
                : question.title || `Pergunta (${question.type})`}
            </Text>
          </Flex>

          <Group gap="xs" wrap="nowrap">
            <Button
              variant="subtle"
              color="blue"
              size="xs"
              onClick={() => onEdit(index)}
              aria-label={t("anamnesisModel.questionItem.editAriaLabel")}
            >
              <IconEdit size={16} />
            </Button>
            {!isFixed && (
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => onRemove(index)}
                aria-label={t("anamnesisModel.questionItem.removeAriaLabel")}
              >
                <IconTrash size={16} />
              </Button>
            )}
          </Group>
        </Flex>
      </Card>
    </div>
  );
};

export default SortableQuestionItem;
