// Import the main IQuestion type
import { IQuestion } from "@/types/QuestionTypes";
import { ISavedAnamnesisModel } from "@/types/anamnesis";

// Define a type for the model structure including an ID and name
/* // Removing the local definition
export interface ISavedAnamnesisModel {
  id: string;
  name: string;
  questions: IQuestion[]; // Assuming IQuestion is appropriate here
  createdAt: Date;
  updatedAt: Date;
}
*/

// Sample data for created anamnesis models
// NOTE: ISavedAnamnesisModel uses a different local Question type definition.
// For this sample data, we are aligning with the structure expected by
// the components which likely use IQuestion from QuestionTypes.ts.
// Ideally, ISavedAnamnesisModel should also use the main IQuestion type.
export const sampleAnamnesisModelsData: (Omit<
  ISavedAnamnesisModel,
  "questions"
> & { questions: IQuestion[] })[] = [
  {
    id: "model-1-abc",
    name: "Basic Intake Model",
    description: "Standard questions for new client intake.",
    questions: [
      {
        type: "welcome",
        title: "Welcome!",
        description: "Let's get started with a few questions.",
        buttonText: "Begin",
        trainerName: "Your Trainer",
        trainerImage: "",
        order: 0,
        required: true,
        standardKey: "welcome",
      },
      {
        type: "text", // Custom Question
        title: "Full Name",
        order: 1,
        required: true,
        value: "",
        // No standardKey
      },
      {
        type: "date",
        title: "Date of Birth",
        order: 2,
        required: true,
        value: null,
        standardKey: "birthDate",
      },
      {
        type: "singleOption",
        title: "Primary Goal",
        order: 3,
        required: true,
        options: [
          { label: "Weight Loss", value: "weight_loss" },
          { label: "Muscle Gain", value: "muscle_gain" },
          { label: "General Fitness", value: "general_fitness" },
        ],
        value: "",
        standardKey: "primaryGoal",
      },
    ],
  },
  {
    id: "model-2-xyz",
    name: "Injury Assessment",
    description: "Focused questions for clients reporting injuries.",
    questions: [
      {
        type: "welcome",
        title: "Injury Details",
        description: "Please provide details about your injury.",
        buttonText: "Start Assessment",
        trainerName: "Recovery Specialist",
        trainerImage: "",
        order: 0,
        required: true,
        standardKey: "welcome",
      },
      {
        type: "multipleOption", // Custom injury question
        title: "Describe the Injury Location",
        order: 1,
        required: true,
        value: [], // Corrected value type for multiple selection
        allowOtherOptionInput: true, // Explicitly add based on IQuestionInjury definition
        allowNoneOption: true, // Explicitly add based on IQuestionInjury definition
        options: [
          { label: "Left Shoulder", value: "left_shoulder" },
          { label: "Right Shoulder", value: "right_shoulder" },
          { label: "Left Knee", value: "left_knee" },
          { label: "Right Knee", value: "right_knee" },
        ],
        // No standardKey
      },
      {
        type: "date", // Custom date question
        title: "When did the injury occur?",
        order: 2,
        required: false,
        value: null,
        // No standardKey
      },
    ],
  },
];

export default sampleAnamnesisModelsData;
