"use client";

import React from "react";
import AnamnesisModelEditor from "@/components/anamnesisModel/AnamnesisModelEditor";
import { IQuestion } from "@/types/QuestionTypes";

// Component now needs to be a client component to define handleSave
const AnamnesisModelEditPage = ({
  params,
}: {
  params: { modelId: string };
}) => {
  const { modelId } = params;

  // Placeholder save function - replace with actual logic for updating
  const handleSave = (questions: IQuestion[]) => {
    console.log(`Saving updated anamnesis model ${modelId}:`, questions);
    // Add logic here to update the questions for the specific modelId
    // Example: updateAnamnesisModel(modelId, questions);
  };

  // Fetch initial data for the model if needed here
  // const initialData = fetchModelData(modelId);

  // Pass modelId and the new onSave prop
  // Also pass initialQuestions={initialData.questions} if fetched
  return <AnamnesisModelEditor modelId={modelId} onSave={handleSave} />;
};

export default AnamnesisModelEditPage;
