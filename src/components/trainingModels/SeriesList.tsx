import React from "react";
import { Card, Flex, Title, Text, Button } from "@mantine/core";
import {
  IconFolder,
  IconStar,
  IconChevronUp,
  IconChevronDown,
  IconTrash,
} from "@tabler/icons-react";
import { useDroppable } from "@dnd-kit/core";
import type { Serie } from "@/types/training";
import { useTranslations } from "next-intl";

// Uncomment the DroppableCard definition
interface DroppableCardProps {
  id: string;
  children: React.ReactNode;
}

const DroppableCard: React.FC<DroppableCardProps> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style: React.CSSProperties = {
    backgroundColor: isOver ? "#e6f7ff" : "transparent",
    transition: "background-color 0.2s ease-in-out",
    borderRadius: "8px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

interface SeriesListProps {
  series: Serie[];
  droppedItems: Record<string, string[]>;
  expandedSeries: Record<string, boolean>;
  handleSeriesNameClick: (serieId: string) => void;
  getDroppedItemCount: (serieId: string) => number;
  toggleFavorite: (serieId: string, event: React.MouseEvent) => void; // Placeholder, needs implementation in parent
  toggleSeriesExpansion: (serieId: string) => void;
  handleRemoveDroppedItem: (serieId: string, position: number) => void;
  hasDroppedItems: (serieId: string) => boolean;
}

export const SeriesList: React.FC<SeriesListProps> = ({
  series,
  droppedItems,
  expandedSeries,
  handleSeriesNameClick,
  getDroppedItemCount,
  toggleFavorite,
  toggleSeriesExpansion,
  handleRemoveDroppedItem,
  hasDroppedItems,
}) => {
  const t = useTranslations();
  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      {/* Ensure scrollability */}
      {series.map((serie: Serie) => {
        const serieId = serie.id;
        const isExpanded = expandedSeries[serieId];
        const canExpand = hasDroppedItems(serieId);

        return (
          <DroppableCard id={serieId} key={serieId}>
            <Card
              shadow="sm"
              padding="lg"
              mb="md" // Use Mantine spacing
              radius="md"
              withBorder
              style={{
                backgroundColor: "#f9f9f9", // Slightly different background
              }}
            >
              <Flex align="center" justify="space-between" mb="xs">
                <Flex align="center" gap="xs">
                  <IconFolder
                    size={20} // Slightly smaller icon
                    color="teal"
                  />
                  <Title
                    order={5} // Adjusted title size
                    style={{ cursor: canExpand ? "pointer" : "default" }}
                    onClick={() => canExpand && handleSeriesNameClick(serieId)}
                  >
                    {serie.name}
                  </Title>
                </Flex>
                <Flex align="center" gap="sm">
                  <Text size="xs" color="dimmed">
                    {t("trainingModels.seriesList.trainingCount", {
                      count: getDroppedItemCount(serieId),
                    })}
                  </Text>
                  <IconStar
                    size={18}
                    fill={serie.isFavorite ? "#FFD700" : "none"}
                    color={serie.isFavorite ? "#FFD700" : "gray"}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => toggleFavorite(serieId, e)} // Connect toggle favorite
                  />
                  {canExpand && (
                    <Button
                      variant="subtle" // Use subtle button for less visual weight
                      size="xs"
                      color="gray"
                      onClick={() => toggleSeriesExpansion(serieId)}
                      p={0} // Remove padding for icon button
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {isExpanded ? (
                        <IconChevronUp size={18} />
                      ) : (
                        <IconChevronDown size={18} />
                      )}
                    </Button>
                  )}
                </Flex>
              </Flex>
              <Text size="sm" color="dimmed">
                {serie.description}
              </Text>
              {isExpanded && (
                <div style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
                  {/* Indent dropped items */}
                  {droppedItems[serieId]?.map((item, idx) => (
                    <Flex
                      key={`${serieId}-dropped-${idx}`}
                      align="center"
                      justify="space-between"
                      style={{ marginBottom: "0.5rem" }} // Reduced margin
                    >
                      <Text size="sm">
                        {idx + 1}. {item}
                      </Text>
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => handleRemoveDroppedItem(serieId, idx)}
                        p={0}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Flex>
                  ))}
                </div>
              )}
            </Card>
          </DroppableCard>
        );
      })}
    </div>
  );
};

export default SeriesList;
