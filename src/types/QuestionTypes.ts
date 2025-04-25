interface IDateQuestion {
  type: "date";
  title: string;
  description?: string;
  value: Date | null;
  required: boolean;
  order: number;
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
  otherValue?: string;
}

interface ITextQuestion {
  type: "text";
  title: string;
  description?: string;
  value: string;
  required: boolean;
  order: number;
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
}

interface IBodyPartsQuestion {
  type: "bodyParts";
  title: string;
  value: string[];
  required: boolean;
  order: number;
  options: {
    label: string;
    value: string;
  }[];
  allowOtherOptionInput?: boolean;
  otherValue?: string;
}

interface IInjuryQuestion {
  type: "injury";
  title: string;
  trainerName: string;
  value: string;
  required: boolean;
  order: number;
}

interface IWelcome {
  type: "welcome";
  title: string;
  description?: string;
  trainerName: string;
  trainerImage: string;
  buttonText: string;
  order: number;
}

type IQuestion =
  | IDateQuestion
  | IMultipleOptionQuestion
  | ISingleOptionQuestion
  | ITextQuestion
  | IMetricQuestion
  | IBodyPartsQuestion
  | IWelcome
  | IInjuryQuestion;

export type {
  IDateQuestion,
  IMultipleOptionQuestion,
  ISingleOptionQuestion,
  ITextQuestion,
  IMetricQuestion,
  IBodyPartsQuestion,
  IWelcome,
  IInjuryQuestion,
  IQuestion,
};
