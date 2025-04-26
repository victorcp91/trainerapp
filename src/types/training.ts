export interface Exercise {
  name: string;
  series: number;
  reps: number;
  advancedTechnique: string;
  notes: string;
  restTime?: number;
  id?: string | number;
  duration?: number;
  distance?: number;
  intensity?: string;
  hiitWorkTime?: number;
  hiitRestTime?: number;
  hiitRounds?: number;
}

export interface TrainingModel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isFavorite: boolean;
  exercises?: Exercise[];
}

export interface Serie {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  createdAt: string;
  level: string;
}

export interface LevelOption {
  value: string;
  label: string;
}

export interface MuscleGroupOption {
  value: string;
  label: string;
}
