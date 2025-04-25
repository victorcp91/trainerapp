"use client";

import React, { useState, useEffect } from "react";
import AnamnesisModelEditor from "@/components/anamnesisModel/AnamnesisModelEditor";
import { IQuestion } from "@/types/QuestionTypes";
import { Loader } from "@mantine/core";
import { notFound } from "next/navigation";
import sampleAnamnesisModels, {
  ISavedAnamnesisModel,
} from "@/app/constants/sampleAnamnesisModels";

// Function to fetch model data (simulated)
// Now fetches from sample data and handles not found case
const fetchModelData = async (
  modelId: string
): Promise<ISavedAnamnesisModel | null> => {
  console.log(`Fetching data for model ${modelId} from sample data...`);
  // Find the model in the sample array
  const model = sampleAnamnesisModels.find((m) => m.id === modelId);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!model) {
    return null; // Return null if model not found
  }
  // Return a deep copy to prevent accidental modification of the constant
  return JSON.parse(JSON.stringify(model));
};

const AnamnesisModelEditPage = ({
  params,
}: {
  params: { modelId: string };
}) => {
  // Access params directly again
  const { modelId } = params;

  // Store the full model or null
  const [modelData, setModelData] = useState<ISavedAnamnesisModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchModelData(modelId);
        if (!data) {
          notFound(); // Trigger 404 if data is null
        } else {
          setModelData(data);
        }
      } catch (error) {
        console.error("Failed to fetch model data:", error);
        // Optional: Show an error message to the user
        notFound(); // Or trigger 404 on fetch error as well
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [modelId]);

  // Placeholder save function
  const handleSave = (questions: IQuestion[]) => {
    // In a real app, you'd update the modelData state and/or send to API
    console.log(`Saving updated anamnesis model ${modelId}:`, questions);
    if (modelData) {
      const updatedModel = { ...modelData, questions };
      setModelData(updatedModel);
      // TODO: Persist changes (e.g., call API updateAnamnesisModel(modelId, updatedModel))
      alert("Model changes logged to console. Implement actual save logic.");
    }
  };

  // Placeholder delete function
  const handleDelete = () => {
    // In a real app, you'd likely show a confirmation modal first
    console.log(`Deleting model ${modelId}...`);
    // TODO: Implement actual deletion logic (e.g., call API deleteAnamnesisModel(modelId))
    // TODO: Redirect user after successful deletion (e.g., back to the models list page)
    alert(
      "Delete action logged to console. Implement actual delete logic and redirection."
    );
    // Example redirection:
    // router.push("/dashboard/anamnesis-models"); // Requires importing useRouter from next/navigation
  };

  if (isLoading) {
    return <Loader />;
  }

  // If loading is finished but modelData is still null, something went wrong (or notFound was called)
  // This check might be redundant if notFound() correctly stops rendering
  if (!modelData) {
    // This might not be reached if notFound() works as expected, but serves as a fallback.
    return <div>Model not found.</div>;
  }

  // Pass the fetched questions and adjust mode
  return (
    <AnamnesisModelEditor
      initialQuestions={modelData.questions} // Pass questions from the fetched model
      onSave={handleSave}
      // onLoadStandard is not relevant in edit mode, provide a no-op or adjust editor
      onLoadStandard={() => {}}
      mode={"edit"} // Set mode to 'edit'
      onDelete={handleDelete} // Pass the delete handler
    />
  );
};

export default AnamnesisModelEditPage;
