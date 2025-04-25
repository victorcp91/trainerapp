import type { Exercise } from "./training";

export interface ExerciseModalSaveData {
  name: string;
  description: string;
  exercises: Exercise[];
}
