import React, { useState, useMemo } from "react";
import {
  Stack,
  Card,
  Text,
  Divider,
  Title,
  Grid,
  Group,
  Select,
} from "@mantine/core";

// Placeholder types - Replace with actual types when available
interface AnamnesisQuestion {
  elementId: string;
  type: string; // 'section_header', 'text', 'radio', 'checkbox', etc.
  title?: string; // For questions
  text?: string; // For section headers
  options?: { value: string; label: string }[];
}

interface AnamnesisModel {
  structure: AnamnesisQuestion[];
}

interface AnamnesisResponse {
  modelId: string; // ID of the model used
  submissionDate: string; // ISO date string
  answers: Record<string, string | string[] | null>; // Map elementId to answer(s)
}

interface AnamnesisTabContentProps {
  clientId: string;
  // Eventually, pass model and response as props
  // model: AnamnesisModel | null;
  // response: AnamnesisResponse | null;
}

// Mock Data - Replace with actual data fetching later
const MOCK_MODEL: AnamnesisModel = {
  structure: [
    // Welcome screen isn't usually part of the structure data to display, skip for now
    // Basic Info Section
    {
      elementId: "sec_basic",
      type: "section_header",
      text: "Informações Básicas",
    },
    { elementId: "birthDate", type: "date", title: "Data de Nascimento" },
    { elementId: "height", type: "text", title: "Altura (cm)" },
    { elementId: "weight", type: "text", title: "Peso Atual (kg)" },
    {
      elementId: "gender",
      type: "radio",
      title: "Gênero",
      options: [
        { value: "male", label: "Masculino" },
        { value: "female", label: "Feminino" },
        { value: "preferNotToSay", label: "Prefiro não informar" },
      ],
    },
    // Goals & Experience Section
    {
      elementId: "sec_goals",
      type: "section_header",
      text: "Objetivos e Experiência",
    },
    {
      elementId: "goal",
      type: "radio",
      title: "Principal Objetivo",
      options: [
        { value: "weightLoss", label: "Emagrecimento" },
        { value: "hypertrophy", label: "Hipertrofia" },
        { value: "strengthGain", label: "Ganho de força" },
        { value: "generalHealth", label: "Melhora da saúde geral" },
        { value: "conditioning", label: "Condicionamento físico" },
      ],
    },
    {
      elementId: "experience",
      type: "radio",
      title: "Nível de Experiência (Musculação)",
      options: [
        { value: "beginner", label: "Iniciante" },
        { value: "intermediate", label: "Intermediário" },
        { value: "advanced", label: "Avançado" },
      ],
    },
    // Training Habits Section
    {
      elementId: "sec_habits",
      type: "section_header",
      text: "Hábitos de Treino",
    },
    {
      elementId: "daysPerWeek",
      type: "select", // Using select as an example
      title: "Quantos dias por semana pode treinar?",
      options: [
        { value: "1", label: "1 dia" },
        { value: "2", label: "2 dias" },
        { value: "3", label: "3 dias" },
        { value: "4", label: "4 dias" },
        { value: "5+", label: "5 ou mais dias" },
      ],
    },
    {
      elementId: "timePerWorkout",
      type: "select",
      title: "Tempo disponível por treino?",
      options: [
        { value: "<30", label: "Até 30 minutos" },
        { value: "30-45", label: "30 a 45 minutos" },
        { value: "45-60", label: "45 a 60 minutos" },
        { value: ">60", label: "Mais de 1 hora" },
      ],
    },
    {
      elementId: "trainingLocation",
      type: "radio",
      title: "Local de Treino",
      options: [
        { value: "home", label: "Em casa" },
        { value: "gym", label: "Academia" },
        { value: "both", label: "Ambos" },
      ],
    },
    {
      elementId: "equipment",
      type: "checkbox",
      title: "Equipamentos Disponíveis",
      options: [
        { value: "none", label: "Nenhum (só peso corporal)" },
        { value: "dumbbells", label: "Halteres" },
        { value: "elasticBands", label: "Faixas elásticas" },
        { value: "benchStep", label: "Banco ou step" },
        { value: "gymMachines", label: "Máquinas de academia" },
      ],
    },
    {
      elementId: "focusMuscles",
      type: "checkbox",
      title: "Músculos Foco",
      options: [
        { value: "legsGlutes", label: "Pernas/glúteos" },
        { value: "chest", label: "Peito" },
        { value: "back", label: "Costas" },
        { value: "arms", label: "Braços" },
        { value: "shoulders", label: "Ombros" },
        { value: "abs", label: "Abdômen" },
      ],
    },
    // Health Conditions Section
    {
      elementId: "sec_health",
      type: "section_header",
      text: "Condições de Saúde",
    },
    {
      elementId: "orthopedic_restrictions",
      type: "checkbox",
      title: "Condições Ortopédicas",
      options: [
        { value: "hernia", label: "Hérnia de disco" },
        { value: "scoliosis", label: "Escoliose" },
        { value: "chondromalacia", label: "Condromalácia patelar" },
        { value: "meniscusLigament", label: "Lesão de menisco/ligamento" },
        { value: "shoulderTendonitis", label: "Tendinite no ombro" },
        { value: "lowBackPain", label: "Lombalgia crônica" },
        { value: "hipBursitis", label: "Bursite/tendinite no quadril" },
        { value: "none", label: "Nenhuma das opções" },
      ],
    },
    {
      elementId: "cardio_restrictions",
      type: "checkbox",
      title: "Condições Cardiorrespiratórias",
      options: [
        { value: "hypertension", label: "Hipertensão arterial" },
        { value: "asthma", label: "Asma/bronquite" },
        { value: "heartDisease", label: "Doença cardíaca" },
        { value: "none", label: "Nenhuma das opções" },
      ],
    },
    {
      elementId: "other_conditions",
      type: "checkbox",
      title: "Outras Condições Relevantes",
      options: [
        { value: "obesity", label: "Obesidade" },
        { value: "diabetes", label: "Diabetes" },
        { value: "varicoseVeins", label: "Varizes/trombose" },
        { value: "pregnancy", label: "Gestação" },
        { value: "none", label: "Nenhuma das opções" },
      ],
    },
    {
      elementId: "restrictions_detail",
      type: "textarea",
      title: "Detalhes Adicionais (Lesões, dores, etc.)",
    },
    // Cardio Preferences Section
    {
      elementId: "sec_cardio",
      type: "section_header",
      text: "Preferências de Cardio",
    },
    {
      elementId: "cardioFeeling",
      type: "radio",
      title: "Como se sente sobre cardio?",
      options: [
        { value: "likeFrequent", label: "Gosto e faço com frequência" },
        { value: "dislikeButDo", label: "Não gosto, mas faço" },
        { value: "avoid", label: "Evito ao máximo" },
        { value: "depends", label: "Depende do tipo" },
      ],
    },
    {
      elementId: "cardioType",
      type: "checkbox",
      title: "Tipos de Cardio Preferidos",
      options: [
        { value: "walking", label: "Caminhada" },
        { value: "running", label: "Corrida" },
        { value: "stationaryBike", label: "Bicicleta Ergométrica" },
        { value: "dance", label: "Dança" },
        { value: "jumpRope", label: "Pular Corda" },
        { value: "swimming", label: "Natação" },
        { value: "elliptical", label: "Elíptico" },
        { value: "none", label: "Nenhum" },
      ],
    },
  ],
};

// Array of mock responses
const MOCK_RESPONSES: AnamnesisResponse[] = [
  {
    // First Response
    modelId: "standardModel123",
    submissionDate: "2024-01-15T09:00:00Z",
    answers: {
      birthDate: "1990-03-12",
      height: "180",
      weight: "85",
      gender: "male",
      goal: "strengthGain",
      experience: "intermediate",
      daysPerWeek: "3",
      timePerWorkout: "45-60",
      trainingLocation: "gym",
      equipment: ["dumbbells", "gymMachines"],
      focusMuscles: ["chest", "back"],
      orthopedic_restrictions: ["none"],
      cardio_restrictions: ["none"],
      other_conditions: ["none"],
      restrictions_detail: "",
      cardioFeeling: "dislikeButDo",
      cardioType: ["running", "stationaryBike"],
    },
  },
  {
    // Second Response (updated weight, different goals/preferences)
    modelId: "standardModel123", // Assuming same model
    submissionDate: "2024-03-10T10:30:00Z",
    answers: {
      birthDate: "1990-03-12", // Same person
      height: "180",
      weight: "82",
      gender: "male", // Updated weight
      goal: "hypertrophy",
      experience: "intermediate",
      daysPerWeek: "4",
      timePerWorkout: "45-60", // Updated goal/days
      trainingLocation: "gym",
      equipment: ["dumbbells", "benchStep", "gymMachines"], // Added bench
      focusMuscles: ["legsGlutes", "arms"], // Changed focus
      orthopedic_restrictions: ["lowBackPain"], // Developed low back pain
      cardio_restrictions: ["none"],
      other_conditions: ["none"],
      restrictions_detail: "Leve desconforto lombar após agachamentos pesados.", // Added detail
      cardioFeeling: "likeFrequent",
      cardioType: ["stationaryBike", "elliptical"], // Changed cardio prefs
    },
  },
  // Add more responses as needed
];
// --- End Mock Data ---

const AnamnesisTabContent: React.FC<AnamnesisTabContentProps> = ({
  clientId,
}) => {
  // State to hold the ID (submissionDate used as ID here) of the selected response
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    MOCK_RESPONSES.length > 0
      ? MOCK_RESPONSES[MOCK_RESPONSES.length - 1].submissionDate
      : null // Default to latest
  );

  // Prepare options for the Select dropdown
  const responseOptions = useMemo(() => {
    return MOCK_RESPONSES.map((resp) => ({
      value: resp.submissionDate, // Use date as unique value
      label: `Respondido em: ${new Date(
        resp.submissionDate
      ).toLocaleDateString()}`,
    })).sort(
      (a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()
    ); // Sort descending by date
  }, []); // Recalculate only if MOCK_RESPONSES changes (it won't here, but good practice)

  // Get the currently selected model and response based on the selected ID
  const { model, response } = useMemo(() => {
    const selectedResponse = MOCK_RESPONSES.find(
      (resp) => resp.submissionDate === selectedResponseId
    );
    // For now, always use the single MOCK_MODEL. Later, fetch based on selectedResponse.modelId
    return {
      model: selectedResponse ? MOCK_MODEL : null,
      response: selectedResponse || null,
    };
  }, [selectedResponseId]); // Recalculate when selection changes

  // Helper to format answers
  const formatAnswer = (
    question: AnamnesisQuestion,
    answer: string | string[] | null | undefined
  ): string => {
    if (answer === null || answer === undefined || answer === "") return "N/A";

    if (question.type === "checkbox") {
      if (!Array.isArray(answer)) return "Resposta inválida";
      return answer
        .map(
          (val) =>
            question.options?.find((opt) => opt.value === val)?.label || val
        )
        .join(", ");
    }

    if (question.type === "radio" || question.type === "select") {
      return (
        question.options?.find((opt) => opt.value === answer)?.label || answer
      );
    }

    // If answer is still an array here (shouldn't happen if checkbox handled above), join it.
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }

    // Explicitly handle non-array types before String() conversion
    if (typeof answer === "string") {
      // Handle date separately if needed for formatting
      // if (question.type === 'date') { ... }
      return answer; // It's already a string
    }

    // Fallback for other simple types (number, boolean - though unlikely based on mock)
    return String(answer);
  };

  // Handle case where there are no responses at all
  if (MOCK_RESPONSES.length === 0) {
    return (
      <Text>Nenhuma resposta de anamnese encontrada para este cliente.</Text>
    );
  }

  return (
    <Stack>
      {/* Add Select dropdown */}
      <Select
        label="Selecionar Resposta da Anamnese"
        placeholder="Escolha uma data"
        data={responseOptions}
        value={selectedResponseId}
        onChange={setSelectedResponseId} // Update state on change
        mb="lg" // Add some margin below
        maw={300} // Max width for the dropdown
      />

      {/* Conditional rendering based on selected response */}
      {!model || !response ? (
        <Text>Selecione uma data para ver as respostas.</Text>
      ) : (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Title order={4}>Respostas da Anamnese</Title>
            {/* Badge no longer needed here as date is in the Select */}
          </Group>
          <Divider my="md" />
          {/* Rendering logic using model and response */}
          {model.structure.map((item, index) => {
            if (item.type === "section_header") {
              return (
                <Title
                  order={5}
                  key={item.elementId}
                  mt={index > 0 ? "lg" : 0}
                  mb="sm"
                >
                  {item.text}
                </Title>
              );
            }

            // Handle questions
            const answer = response.answers[item.elementId];
            const formattedAnswer = formatAnswer(item, answer);

            return (
              <Grid key={item.elementId} gutter="sm" mb="xs">
                <Grid.Col span={{ base: 12, sm: 5 }}>
                  <Text fw={500}>{item.title}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 7 }}>
                  <Text>{formattedAnswer}</Text>
                </Grid.Col>
                {/* Add a divider unless it's the last item or followed by a header */}
                {index < model.structure.length - 1 &&
                  model.structure[index + 1]?.type !== "section_header" && (
                    <Grid.Col span={12}>
                      <Divider variant="dotted" my="xs" />
                    </Grid.Col>
                  )}
              </Grid>
            );
          })}
        </Card>
      )}
    </Stack>
  );
};

export default AnamnesisTabContent;
