// import { IQuestion } from "@/types/QuestionTypes"; // Remove unused import
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
export const sampleAnamnesisModelsData: ISavedAnamnesisModel[] = [
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
      },
      {
        type: "text",
        title: "Full Name",
        order: 1,
        required: true,
        value: "",
      },
      {
        type: "date",
        title: "Date of Birth",
        order: 2,
        required: true,
        value: null,
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
      },
      {
        type: "injury",
        title: "Describe the Injury Location",
        order: 1,
        required: true,
        trainerName: "", // Usually filled dynamically, but required
        value: "",
      },
      {
        type: "date",
        title: "When did the injury occur?",
        order: 2,
        required: false,
        value: null,
      },
    ],
  },
];

export default sampleAnamnesisModelsData;
