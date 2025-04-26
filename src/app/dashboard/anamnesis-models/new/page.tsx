"use client";

import React, { Suspense, useState, useEffect } from "react";
import AnamnesisModelEditor from "@/components/anamnesisModel/AnamnesisModelEditor";
import { IQuestion } from "@/types/QuestionTypes";
import { useSearchParams } from "next/navigation";
import standardAnamnesisModel from "@/constants/standardAnamnesisModel";
import { Loader } from "@mantine/core";
import { useTranslations } from "next-intl";

// Helper function to translate model data
// Use a type that represents the translation function, e.g., from useTranslations return type
// This might need adjustment based on the actual exported type from next-intl
type TFunction = ReturnType<typeof useTranslations>;

const translateModel = (model: IQuestion[], t: TFunction): IQuestion[] => {
  return model.map((q) => {
    const translatedQuestion = { ...q };

    // Translate title
    if (translatedQuestion.title) {
      translatedQuestion.title = t(translatedQuestion.title);
    }

    // Translate description (if applicable)
    if ("description" in translatedQuestion && translatedQuestion.description) {
      translatedQuestion.description = t(translatedQuestion.description);
    }

    // Translate fields specific to 'welcome' type
    if (translatedQuestion.type === "welcome") {
      if (translatedQuestion.buttonText) {
        translatedQuestion.buttonText = t(translatedQuestion.buttonText);
      }
      if (translatedQuestion.trainerName) {
        translatedQuestion.trainerName = t(translatedQuestion.trainerName);
      }
      if (translatedQuestion.trainerImage) {
        // Only translate if it's likely a key (not empty or a potential URL)
        // Basic check: doesn't contain typical URL characters like '/' or '.'
        // Or simply attempt translation, and if it returns the key, handle it.
        // Let's try translating directly for simplicity. If the key exists,
        // it gets translated. If not, t() returns the key (which might be empty).
        translatedQuestion.trainerImage = t(translatedQuestion.trainerImage);
      }
    }

    // Translate options labels (if applicable)
    if (
      "options" in translatedQuestion &&
      Array.isArray(translatedQuestion.options)
    ) {
      // Ensure opt.label is treated as a full key for the root translator
      translatedQuestion.options = translatedQuestion.options.map((opt) => ({
        ...opt,
        label: t(opt.label), // Translate label using root t and full key from opt.label
      }));
    }

    return translatedQuestion;
  });
};

// Define the actual component logic
const AnamnesisModelNewPageContent = () => {
  const searchParams = useSearchParams();
  const t = useTranslations(); // Get translation function
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
      let initialData: IQuestion[] = [];
      if (loadStandard) {
        const rawModel = JSON.parse(JSON.stringify(standardAnamnesisModel));
        initialData = translateModel(rawModel, t); // Translate here
      }
      setCurrentQuestions(initialData);
      setInitialLoadDone(true); // Mark initial load as done
    }
  }, [searchParams, initialLoadDone, t]); // Depend on searchParams, initialLoadDone, and t

  // Handler to load standard model questions on button click
  const handleLoadStandard = () => {
    const rawModel = JSON.parse(JSON.stringify(standardAnamnesisModel));
    const translatedData = translateModel(rawModel, t); // Translate here
    setCurrentQuestions(translatedData);
    // Optionally, could switch mode here if needed, but might be confusing.
    // Keep mode based on initial entry for now.
  };

  // Handler for saving the model
  const handleSave = (questionsToSave: IQuestion[]) => {
    console.log(`Saving ${mode} anamnesis model:`, questionsToSave);
    // TODO: Add logic here to save the questions (e.g., API call)
    // If saving needs to store keys, reverse translation would be needed here.
    // For now, assume we save the translated strings.
    alert("Model save logged to console. Implement actual save logic.");
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
