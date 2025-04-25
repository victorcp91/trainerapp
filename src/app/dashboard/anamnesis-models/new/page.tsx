"use client";

import React, { Suspense, useState, useEffect } from "react";
import AnamnesisModelEditor from "@/components/anamnesisModel/AnamnesisModelEditor";
import { IQuestion } from "@/types/QuestionTypes";
import { useSearchParams } from "next/navigation";
import standardAnamnesisModel from "@/constants/simpleAnamnesisModel";
import { Loader } from "@mantine/core";

// Define the actual component logic
const AnamnesisModelNewPageContent = () => {
  const searchParams = useSearchParams();
  // State to hold the current questions
  const [currentQuestions, setCurrentQuestions] = useState<IQuestion[]>([]);
  // State to track initial load based on query param
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Determine mode based on query param (only on initial check)
  const mode =
    searchParams?.get("loadStandard") === "true"
      ? "create_from_standard"
      : "new";

  // Effect to load initial questions based on query param ONCE
  useEffect(() => {
    if (searchParams && !initialLoadDone) {
      const loadStandard = searchParams.get("loadStandard") === "true";
      const initialData = loadStandard
        ? JSON.parse(JSON.stringify(standardAnamnesisModel))
        : [];
      setCurrentQuestions(initialData);
      setInitialLoadDone(true); // Mark initial load as done
    }
  }, [searchParams, initialLoadDone]); // Depend on searchParams and initialLoadDone

  // Handler to load standard model questions on button click
  const handleLoadStandard = () => {
    setCurrentQuestions(JSON.parse(JSON.stringify(standardAnamnesisModel)));
    // Optionally, could switch mode here if needed, but might be confusing.
    // Keep mode based on initial entry for now.
  };

  // Handler for saving the model
  const handleSave = (questionsToSave: IQuestion[]) => {
    console.log(`Saving ${mode} anamnesis model:`, questionsToSave);
    // Add logic here to save the questions (e.g., API call)
  };

  // Show loader until searchParams are available and initial load is processed
  if (!searchParams || !initialLoadDone) {
    return <Loader />;
  }

  return (
    <AnamnesisModelEditor
      initialQuestions={currentQuestions} // Pass state to editor
      onSave={handleSave}
      onLoadStandard={handleLoadStandard} // Pass load handler
      mode={mode}
    />
  );
};

// Wrap the component with Suspense for useSearchParams
const AnamnesisModelNewPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AnamnesisModelNewPageContent />
    </Suspense>
  );
};

export default AnamnesisModelNewPage;
