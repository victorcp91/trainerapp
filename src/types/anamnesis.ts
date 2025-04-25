// Represents selectable options
export interface AnamnesisOption {
  label: string;
  value: string;
}

// Base structure for all question types
interface BaseQuestion {
  type: string; // Discriminator field
  title: string;
  order: number;
  required: boolean;
  description?: string; // Optional description
}

// Specific question types extending the base
export interface WelcomeQuestion extends BaseQuestion {
  type: "welcome";
  buttonText: string;
  trainerName: string;
  trainerImage?: string;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  value: string; // Current value
}

export interface DateQuestion extends BaseQuestion {
  type: "date";
  value: Date | null; // Current value
}

export interface SingleOptionQuestion extends BaseQuestion {
  type: "singleOption";
  options: AnamnesisOption[];
  value: string; // Current selected value (corresponds to AnamnesisOption.value)
}

// Example for injury type - add others as needed
export interface InjuryQuestion extends BaseQuestion {
  type: "injury";
  trainerName: string; // Required even if sometimes empty?
  value: string; // Current value
}

// Union type for any possible question
export type Question =
  | WelcomeQuestion
  | TextQuestion
  | DateQuestion
  | SingleOptionQuestion
  | InjuryQuestion;

// Updated model structure based on sample data
export interface ISavedAnamnesisModel {
  id: string;
  name: string;
  description: string; // Added description
  questions: Question[]; // Use the new union type
  // Removed createdAt/updatedAt as they are not in the sample data
}
