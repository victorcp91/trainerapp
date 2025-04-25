import React from "react";
import { Card, Flex, Title, Text } from "@mantine/core";
import { IconEdit, IconStar, IconGripVertical } from "@tabler/icons-react";
import { useDraggable } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { TrainingModel } from "@/types/training";

// Temporary local definition - consider moving to a shared location
interface DraggableCardProps {
  id: string;
  children:
    | React.ReactNode
    | ((listeners: SyntheticListenerMap) => React.ReactNode);
}

const DraggableCard: React.FC<DraggableCardProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const style: React.CSSProperties = {
    userSelect: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {typeof children === "function" ? children(listeners ?? {}) : children}
    </div>
  );
};
// End Temporary definition

interface TrainingModelListProps {
  models: TrainingModel[];
  handleCardClick: (event: React.MouseEvent) => void;
  handleEditModel: (model: TrainingModel, event: React.MouseEvent) => void;
  toggleFavorite: (model: TrainingModel, event: React.MouseEvent) => void;
}

export const TrainingModelList: React.FC<TrainingModelListProps> = ({
  models,
  handleCardClick,
  handleEditModel,
  toggleFavorite,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
        overflowY: "auto",
        // Consider setting a max height if needed, e.g., height: 'calc(100vh - someOffset)'
      }}
    >
      {models.map((model: TrainingModel) => (
        <DraggableCard id={model.id} key={model.id}>
          {(dragListeners) => (
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                border: "1px solid #e0e0e0",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
              onClick={handleCardClick} // Prevent drag initiation on general card click
            >
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Title order={4}>{model.name}</Title>
                  <IconEdit
                    size={20}
                    color="gray"
                    style={{
                      cursor: "pointer",
                      marginLeft: "0.5rem",
                    }}
                    onClick={(event) => handleEditModel(model, event)}
                  />
                </Flex>
                <Flex align="center" gap="xs">
                  {" "}
                  {/* Added gap for spacing */}
                  <IconStar
                    size={20}
                    fill={model.isFavorite ? "#FFD700" : "none"} // Fill if favorite
                    color={model.isFavorite ? "#FFD700" : "gray"}
                    style={{ cursor: "pointer" }}
                    onClick={(event) => toggleFavorite(model, event)}
                  />
                  <div {...dragListeners} style={{ cursor: "grab" }}>
                    {" "}
                    {/* Apply listeners only to handle */}
                    <IconGripVertical size={20} color="gray" />
                  </div>
                </Flex>
              </Flex>
              <Text size="sm" color="dimmed" mt="xs">
                {" "}
                {/* Added margin top */}
                {model.description}
              </Text>
            </Card>
          )}
        </DraggableCard>
      ))}
    </div>
  );
};

export default TrainingModelList;
