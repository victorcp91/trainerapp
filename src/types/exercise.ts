// import { MuscleGroup } from "@/constants/muscleGroups"; // Comment out unused import causing error

export enum ExerciseType {
  STRENGTH = "strength",
  STEADY_AEROBIC = "steady_aerobic",
  HIIT_AEROBIC = "hiit_aerobic",
  STRETCHING = "stretching",
}

export interface IExercise {
  id: string; // Unique ID for this exercise instance within a plan/model
  modelExerciseId?: string; // Original ID if from a model
  name: string;
  notes?: string;
  order: number;
  type: ExerciseType;
  imageLottie?: string; // Path/identifier for Lottie animation
  // muscleGroups?: MuscleGroup[]; // Comment out field using the missing type

  // Strength fields
  sets?: number;
  reps?: number | string; // e.g., 10 or "8-12"
  restTime?: number; // seconds
  advancedTechnique?: string; // e.g., 'Drop-set'
  targetWeight?: number; // kg

  // Steady Aerobic fields
  targetDuration?: number; // seconds
  targetDistance?: number; // km
  targetIntensity?: string; // e.g., 'Zone 2 HR'
  isOutdoor?: boolean; // Relevant for GPS

  // HIIT Aerobic fields
  hiitWorkTime?: number; // seconds
  hiitRestTime?: number; // seconds
  hiitRounds?: number;
  // isOutdoor is shared with steady

  // Stretching fields
  holdDuration?: number; // seconds
  // sets and restTime reused from Strength
}
