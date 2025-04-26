interface IDateQuestion {
  type: "date";
  title: string;
  description?: string;
  value: Date | null;
  required: boolean;
  order: number;
  standardKey?: StandardQuestionKey;
}

interface ISingleOptionQuestion {
  type: "singleOption";
  title: string;
  description?: string;
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  required: boolean;
  order: number;
  allowOtherOptionInput?: boolean;
  allowNoneOption?: boolean;
  standardKey?: StandardQuestionKey;
  otherValue?: string;
}

interface IMultipleOptionQuestion {
  type: "multipleOption";
  title: string;
  description?: string;
  options: {
    label: string;
    value: string;
  }[];
  value: string[];
  required: boolean;
  order: number;
  allowOtherOptionInput?: boolean;
  allowNoneOption?: boolean;
  standardKey?: StandardQuestionKey;
  otherValue?: string;
}

interface ITextQuestion {
  type: "text";
  title: string;
  description?: string;
  value: string;
  required: boolean;
  order: number;
  standardKey?: StandardQuestionKey;
}

interface IMetricQuestion {
  type: "metric";
  title: string;
  description?: string;
  value: number;
  required: boolean;
  metric: "kg" | "g" | "mg" | "cm" | "mm" | "l" | "ml" | "%" | "lb" | "oz";
  order: number;
  allowOtherOptionInput?: boolean;
  otherValue?: string;
  standardKey?: StandardQuestionKey;
}

interface IBodyPartsQuestion {
  type: "bodyParts";
  title: string;
  value: string[];
  required: boolean;
  order: number;
  allowOtherOptionInput?: boolean;
  allowNoneOption?: boolean;
  otherValue?: string;
  standardKey?: StandardQuestionKey;
}

interface IWelcome {
  type: "welcome";
  title: string;
  description?: string;
  trainerName: string;
  trainerImage: string;
  buttonText: string;
  order: number;
  required: boolean;
  standardKey?: StandardQuestionKey;
}

export type StandardQuestionKey =
  | "welcome"
  | "birthDate"
  | "height"
  | "weight"
  | "gender"
  | "primaryGoal"
  | "experienceLevel"
  | "trainingDays"
  | "sessionTime"
  | "trainingLocation"
  | "equipmentAccess"
  | "focusMuscleGroups"
  | "orthopedicLimitations"
  | "cardioTypes";

type IQuestion =
  | IDateQuestion
  | IMultipleOptionQuestion
  | ISingleOptionQuestion
  | ITextQuestion
  | IMetricQuestion
  | IBodyPartsQuestion
  | IWelcome;

export type {
  IDateQuestion,
  IMultipleOptionQuestion,
  ISingleOptionQuestion,
  ITextQuestion,
  IMetricQuestion,
  IBodyPartsQuestion,
  IWelcome,
  IQuestion,
};
