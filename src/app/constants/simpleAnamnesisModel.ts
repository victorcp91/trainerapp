import { IQuestion } from "@/types/QuestionTypes";

// Define keys for reuse
const sa = "standardAnamnesis"; // Abbreviation for standardAnamnesis

const standardAnamnesisModel: IQuestion[] = [
  {
    type: "date",
    title: `${sa}.birthDate.title`, // Use key
    value: null,
    required: true,
    order: 0,
  },
  {
    type: "metric",
    title: `${sa}.height.title`, // Use key
    value: 0,
    required: true,
    metric: "cm",
    order: 1,
  },
  {
    type: "metric",
    title: `${sa}.weight.title`, // Use key
    value: 0,
    required: true,
    metric: "kg",
    order: 2,
  },
  {
    type: "singleOption",
    title: `${sa}.gender.title`, // Use key
    options: [
      { label: `${sa}.gender.male`, value: "masculino" },
      { label: `${sa}.gender.female`, value: "feminino" },
      {
        label: `${sa}.gender.preferNotToSay`,
        value: "prefiro_nao_informar",
      },
      { label: `${sa}.common.other`, value: "outro" }, // Add "Other" option explicitly if needed by allowOtherOptionInput
    ],
    value: "",
    required: true,
    order: 3,
    allowOtherOptionInput: true,
  },
  {
    type: "singleOption",
    title: `${sa}.goal.title`, // Use key
    options: [
      { label: `${sa}.goal.weightLoss`, value: "emagrecimento" },
      { label: `${sa}.goal.hypertrophy`, value: "hipertrofia" },
      { label: `${sa}.goal.strengthGain`, value: "ganho_de_forca" },
      {
        label: `${sa}.goal.generalHealth`,
        value: "melhora_saude_geral",
      },
      {
        label: `${sa}.goal.conditioning`,
        value: "condicionamento_fisico",
      },
      { label: `${sa}.common.other`, value: "outro" },
    ],
    value: "",
    required: true,
    order: 4,
    allowOtherOptionInput: true,
  },
  {
    type: "singleOption",
    title: `${sa}.experience.title`, // Use key
    options: [
      { label: `${sa}.experience.beginner`, value: "iniciante" },
      {
        label: `${sa}.experience.intermediate`,
        value: "intermediario",
      },
      { label: `${sa}.experience.advanced`, value: "avancado" },
    ],
    value: "",
    required: true,
    order: 5,
  },
  {
    type: "singleOption",
    title: `${sa}.daysPerWeek.title`, // Use key
    options: [
      { label: `${sa}.daysPerWeek.option1`, value: "1" }, // Use keys for numbers
      { label: `${sa}.daysPerWeek.option2`, value: "2" },
      { label: `${sa}.daysPerWeek.option3`, value: "3" },
      { label: `${sa}.daysPerWeek.option4`, value: "4" },
      { label: `${sa}.daysPerWeek.fiveOrMore`, value: "5_ou_mais" },
    ],
    value: "",
    required: true,
    order: 6,
  },
  {
    type: "singleOption",
    title: `${sa}.timePerWorkout.title`, // Use key
    options: [
      {
        label: `${sa}.timePerWorkout.upTo30`,
        value: "ate_30_minutos",
      },
      {
        label: `${sa}.timePerWorkout.30to45`,
        value: "30_a_45_minutos",
      },
      {
        label: `${sa}.timePerWorkout.45to60`,
        value: "45_a_60_minutos",
      },
      {
        label: `${sa}.timePerWorkout.over60`,
        value: "mais_de_1_hora",
      },
    ],
    value: "",
    required: true,
    order: 7,
  },
  {
    type: "singleOption",
    title: `${sa}.trainingLocation.title`, // Use key
    options: [
      { label: `${sa}.trainingLocation.home`, value: "em_casa" },
      { label: `${sa}.trainingLocation.gym`, value: "academia" },
      { label: `${sa}.trainingLocation.both`, value: "ambos" },
      { label: `${sa}.common.other`, value: "outro" },
    ],
    value: "",
    required: true,
    order: 8,
    allowOtherOptionInput: true,
  },
  {
    type: "multipleOption",
    title: `${sa}.equipment.title`, // Use key
    options: [
      { label: `${sa}.equipment.none`, value: "nenhum" },
      { label: `${sa}.equipment.dumbbells`, value: "halteres" },
      {
        label: `${sa}.equipment.elasticBands`,
        value: "faixas_elasticas",
      },
      { label: `${sa}.equipment.benchStep`, value: "banco_step" },
      {
        label: `${sa}.equipment.gymMachines`,
        value: "maquinas_academia",
      },
      { label: `${sa}.common.other`, value: "outro" },
    ],
    value: [],
    required: true,
    order: 9,
    allowOtherOptionInput: true,
  },
  {
    type: "multipleOption",
    title: `${sa}.focusMuscles.title`, // Use key
    options: [
      {
        label: `${sa}.focusMuscles.legsGlutes`,
        value: "pernas_gluteos",
      },
      { label: `${sa}.focusMuscles.chest`, value: "peito" },
      { label: `${sa}.focusMuscles.back`, value: "costas" },
      { label: `${sa}.focusMuscles.arms`, value: "bracos" },
      { label: `${sa}.focusMuscles.shoulders`, value: "ombros" },
      { label: `${sa}.focusMuscles.abs`, value: "abdomen" },
    ],
    value: [],
    required: true,
    order: 10,
  },
  {
    type: "multipleOption",
    title: `${sa}.orthopedic.title`, // Already uses key
    options: [
      { label: `${sa}.orthopedic.hernia`, value: "hernia_disco" },
      {
        label: `${sa}.orthopedic.scoliosis`,
        value: "escoliose_postura",
      },
      {
        label: `${sa}.orthopedic.chondromalacia`,
        value: "condromalacia_patelar",
      },
      {
        label: `${sa}.orthopedic.meniscusLigament`,
        value: "lesao_menisco_ligamento",
      },
      {
        label: `${sa}.orthopedic.shoulderTendonitis`,
        value: "tendinite_ombro",
      },
      {
        label: `${sa}.orthopedic.lowBackPain`,
        value: "lombalgia_cronica",
      },
      {
        label: `${sa}.orthopedic.hipBursitis`,
        value: "bursite_tendinite_quadril",
      },
      { label: `${sa}.common.none`, value: "nenhuma_ortopedica" },
      { label: `${sa}.common.other`, value: "outro_ortopedica" },
    ],
    value: [],
    required: false,
    order: 11,
    allowOtherOptionInput: true,
  },
  {
    type: "multipleOption",
    title: `${sa}.cardio.title`, // Already uses key
    options: [
      {
        label: `${sa}.cardio.hypertension`,
        value: "hipertensao_arterial",
      },
      { label: `${sa}.cardio.asthma`, value: "asma_bronquite" },
      {
        label: `${sa}.cardio.heartDisease`,
        value: "doenca_cardiaca",
      },
      { label: `${sa}.common.none`, value: "nenhuma_cardio" },
      { label: `${sa}.common.other`, value: "outro_cardio" },
    ],
    value: [],
    required: false,
    order: 12,
    allowOtherOptionInput: true,
  },
  {
    type: "multipleOption",
    title: `${sa}.otherConditions.title`, // Already uses key
    options: [
      {
        label: `${sa}.otherConditions.obesity`,
        value: "obesidade",
      },
      {
        label: `${sa}.otherConditions.diabetes`,
        value: "diabetes",
      },
      {
        label: `${sa}.otherConditions.varicoseVeins`,
        value: "varizes_trombose",
      },
      {
        label: `${sa}.otherConditions.pregnancy`,
        value: "gestacao",
      },
      { label: `${sa}.common.none`, value: "nenhuma_outra" },
      { label: `${sa}.common.other`, value: "outro_outra" },
    ],
    value: [],
    required: false,
    order: 13,
    allowOtherOptionInput: true,
  },
  {
    type: "singleOption",
    title: `${sa}.cardioFeeling.title`, // Use key
    options: [
      { label: `${sa}.cardioFeeling.likeFrequent`, value: "gosto_frequente" },
      { label: `${sa}.cardioFeeling.dislikeButDo`, value: "nao_gosto_faco" },
      { label: `${sa}.cardioFeeling.avoid`, value: "evito_maximo" },
      { label: `${sa}.cardioFeeling.depends`, value: "depende_tipo" },
    ],
    value: "",
    required: false,
    order: 14,
  },
  {
    type: "multipleOption",
    title: `${sa}.cardioType.title`, // Use key
    options: [
      { label: `${sa}.cardioType.walking`, value: "caminhada" },
      { label: `${sa}.cardioType.running`, value: "corrida" },
      { label: `${sa}.cardioType.stationaryBike`, value: "bicicleta" },
      { label: `${sa}.cardioType.dance`, value: "danca" },
      { label: `${sa}.cardioType.jumpRope`, value: "pular_corda" },
      { label: `${sa}.cardioType.stairs`, value: "escadas" },
      { label: `${sa}.cardioType.swimming`, value: "natacao" },
      { label: `${sa}.cardioType.elliptical`, value: "eliptico" },
      { label: `${sa}.common.other`, value: "outro_cardio_tipo" },
      { label: `${sa}.cardioType.none`, value: "nenhum_cardio_tipo" },
    ],
    value: [],
    required: false,
    order: 15,
    allowOtherOptionInput: true,
  },
];

export default standardAnamnesisModel;
