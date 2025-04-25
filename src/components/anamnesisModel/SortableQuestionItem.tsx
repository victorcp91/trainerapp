"use client";

import React from "react";
import { Card, Flex, Text, Button, Group } from "@mantine/core";
import { IconTrash, IconGripVertical, IconEdit } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IQuestion } from "@/types/QuestionTypes";

interface SortableQuestionItemProps {
  index: number; // Back to using index as ID for dnd-kit
  question: IQuestion;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  getQuestionTypeIcon: (type: string) => React.ElementType;
  t: (key: string) => string;
}

const SortableQuestionItem: React.FC<SortableQuestionItemProps> = ({
  index,
  question,
  onRemove,
  onEdit,
  getQuestionTypeIcon,
  t,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: index }); // Back to using index as ID

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : "auto",
    // Removed marginBottom, let Stack in parent handle spacing
  };

  const Icon = getQuestionTypeIcon(question.type);

  return (
    // Attach attributes and listeners to the outer div for the whole item to be draggable
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Flex align="center" justify="space-between">
          {/* Drag Handle on the left */}
          <Group gap="xs" {...listeners} style={{ cursor: "grab" }}>
            <IconGripVertical size={20} color="gray" />
          </Group>

          {/* Question Info */}
          <Flex
            align="center"
            style={{ flexGrow: 1, marginLeft: "10px", marginRight: "10px" }}
          >
            <Icon size={20} style={{ marginRight: "8px", flexShrink: 0 }} />
            <Text fw={500} truncate>
              {" "}
              {/* Conditionally translate title only if it looks like a key */}
              {question.title.includes(".")
                ? t(question.title)
                : question.title || `Pergunta (${question.type})`}
            </Text>
          </Flex>

          {/* Action Buttons on the right */}
          <Group gap="xs" wrap="nowrap">
            <Button
              variant="subtle"
              color="blue"
              size="xs"
              onClick={() => onEdit(index)}
              aria-label="Editar pergunta"
            >
              <IconEdit size={16} />
            </Button>
            <Button
              variant="subtle"
              color="red"
              size="xs"
              onClick={() => onRemove(index)}
              aria-label="Remover pergunta"
            >
              <IconTrash size={16} />
            </Button>
          </Group>
        </Flex>
        {/* Optional: Display more question details if needed */}
        {/* e.g., Description, Options, etc. */}
      </Card>
    </div>
  );
};

export default SortableQuestionItem;
