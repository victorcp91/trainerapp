import { IQuestion } from "@/types/QuestionTypes";

// Define keys for reuse
const sa = "standardAnamnesis"; // Abbreviation for standardAnamnesis

const standardAnamnesisModel: IQuestion[] = [
  {
    type: "welcome",
    title: `${sa}.welcome.title`, // Use key
    trainerName: `${sa}.trainer.name`, // Use key for trainer name
    trainerImage: `${sa}.trainer.image`, // Use key for trainer image
    description: `${sa}.welcome.description`, // Use key for description
    buttonText: `${sa}.welcome.buttonText`, // Use key for button text
    required: false,
    order: 0, // Welcome screen is first
    standardKey: "welcome",
  },
  {
    type: "date",
    title: `${sa}.birthDate.title`, // Use key
    value: null,
    required: true,
    order: 1, // Incremented order
    standardKey: "birthDate",
  },
  {
    type: "metric",
    title: `${sa}.height.title`, // Use key
    value: 0,
    required: true,
    metric: "cm",
    order: 2, // Incremented order
    standardKey: "height",
  },
  {
    type: "metric",
    title: `${sa}.weight.title`, // Use key
    value: 0,
    required: true,
    metric: "kg",
    order: 3, // Incremented order
    standardKey: "weight",
  },
  {
    type: "singleOption",
    title: `${sa}.gender.title`, // Use key
    options: [
      { label: `${sa}.gender.male`, value: "male" },
      { label: `${sa}.gender.female`, value: "female" },
      { label: `${sa}.gender.preferNotToSay`, value: "prefer_not_to_say" },
    ],
    value: "",
    required: true,
    order: 4, // Incremented order
    allowOtherOptionInput: true,
    standardKey: "gender",
  },
  {
    type: "singleOption",
    title: `${sa}.goal.title`, // Use key
    options: [
      { label: `${sa}.goal.weightLoss`, value: "weight_loss" },
      { label: `${sa}.goal.hypertrophy`, value: "hypertrophy" },
      { label: `${sa}.goal.strengthGain`, value: "strength_gain" },
      {
        label: `${sa}.goal.generalHealth`,
        value: "general_health_improvement",
      },
      { label: `${sa}.goal.conditioning`, value: "physical_conditioning" },
    ],
    value: "",
    required: true,
    order: 5, // Incremented order
    allowOtherOptionInput: true,
    standardKey: "primaryGoal",
  },
  {
    type: "singleOption",
    title: `${sa}.experience.title`, // Use key
    options: [
      { label: `${sa}.experience.beginner`, value: "beginner" },
      {
        label: `${sa}.experience.intermediate`,
        value: "intermediate",
      },
      { label: `${sa}.experience.advanced`, value: "advanced" },
    ],
    value: "",
    required: true,
    order: 6, // Incremented order
    standardKey: "experienceLevel",
  },
  {
    type: "multipleOption",
    title: `${sa}.daysPerWeek.title`,
    options: [
      { label: `common.weekdays.monday`, value: "monday" },
      { label: `common.weekdays.tuesday`, value: "tuesday" },
      { label: `common.weekdays.wednesday`, value: "wednesday" },
      { label: `common.weekdays.thursday`, value: "thursday" },
      { label: `common.weekdays.friday`, value: "friday" },
      { label: `common.weekdays.saturday`, value: "saturday" },
      { label: `common.weekdays.sunday`, value: "sunday" },
    ],
    value: [],
    required: true,
    order: 7,
    standardKey: "trainingDays",
  },
  {
    type: "singleOption",
    title: `${sa}.timePerWorkout.title`, // Use key
    options: [
      {
        label: `${sa}.timePerWorkout.upTo30`,
        value: "up_to_30_minutes",
      },
      {
        label: `${sa}.timePerWorkout.30to45`,
        value: "30_to_45_minutes",
      },
      {
        label: `${sa}.timePerWorkout.45to60`,
        value: "45_to_60_minutes",
      },
      {
        label: `${sa}.timePerWorkout.over60`,
        value: "over_60_minutes",
      },
    ],
    value: "",
    required: true,
    order: 8, // Incremented order
    standardKey: "sessionTime",
  },
  {
    type: "singleOption",
    title: `${sa}.trainingLocation.title`, // Use key
    options: [
      { label: `${sa}.trainingLocation.home`, value: "at_home" },
      { label: `${sa}.trainingLocation.gym`, value: "gym" },
      { label: `${sa}.trainingLocation.both`, value: "both" },
    ],
    value: "",
    required: true,
    order: 9, // Incremented order
    allowOtherOptionInput: true,
    standardKey: "trainingLocation",
  },
  {
    type: "multipleOption",
    title: `${sa}.equipment.title`, // Use key
    options: [
      { label: `${sa}.equipment.dumbbells`, value: "dumbbells" },
      { label: `${sa}.equipment.elasticBands`, value: "elastic_bands" },
      { label: `${sa}.equipment.benchStep`, value: "bench_step" },
      { label: `${sa}.equipment.gymMachines`, value: "gym_machines" },
    ],
    value: [],
    required: true,
    order: 10, // Incremented order
    allowOtherOptionInput: true,
    allowNoneOption: true,
    standardKey: "equipmentAccess",
  },
  {
    type: "multipleOption",
    title: `${sa}.focusMuscles.title`, // Use key
    options: [
      {
        label: `${sa}.focusMuscles.legsGlutes`,
        value: "legs_glutes",
      },
      { label: `${sa}.focusMuscles.chest`, value: "chest" },
      { label: `${sa}.focusMuscles.back`, value: "back" },
      { label: `${sa}.focusMuscles.arms`, value: "arms" },
      { label: `${sa}.focusMuscles.shoulders`, value: "shoulders" },
      { label: `${sa}.focusMuscles.abs`, value: "abs" },
    ],
    value: [],
    required: true,
    order: 11, // Incremented order
    standardKey: "focusMuscleGroups",
  },
  {
    type: "multipleOption",
    title: `${sa}.orthopedic.title`,
    options: [
      { label: `${sa}.orthopedic.hernia`, value: `${sa}.orthopedic.hernia` },
      {
        label: `${sa}.orthopedic.scoliosis`,
        value: `${sa}.orthopedic.scoliosis`,
      },
      {
        label: `${sa}.orthopedic.chondromalacia`,
        value: `${sa}.orthopedic.chondromalacia`,
      },
      {
        label: `${sa}.orthopedic.meniscusLigament`,
        value: `${sa}.orthopedic.meniscusLigament`,
      },
      {
        label: `${sa}.orthopedic.shoulderTendonitis`,
        value: `${sa}.orthopedic.shoulderTendonitis`,
      },
      {
        label: `${sa}.orthopedic.lowBackPain`,
        value: `${sa}.orthopedic.lowBackPain`,
      },
      {
        label: `${sa}.orthopedic.hipBursitis`,
        value: `${sa}.orthopedic.hipBursitis`,
      },
    ],
    value: [],
    required: false,
    order: 12,
    allowOtherOptionInput: true,
    allowNoneOption: true,
    standardKey: "orthopedicLimitations",
  },
  {
    type: "multipleOption",
    title: `${sa}.cardio.title`, // Already uses key
    options: [
      {
        label: `${sa}.cardio.hypertension`,
        value: "arterial_hypertension",
      },
      { label: `${sa}.cardio.asthma`, value: "asthma_bronchitis" },
      {
        label: `${sa}.cardio.heartDisease`,
        value: "heart_disease",
      },
    ],
    value: [],
    required: false,
    order: 13, // Incremented order
    allowOtherOptionInput: true,
    allowNoneOption: true,
  },
  {
    type: "multipleOption",
    title: `${sa}.otherConditions.title`, // Already uses key
    options: [
      {
        label: `${sa}.otherConditions.obesity`,
        value: "obesity",
      },
      {
        label: `${sa}.otherConditions.diabetes`,
        value: "diabetes",
      },
      {
        label: `${sa}.otherConditions.varicoseVeins`,
        value: "varicose_veins_thrombosis",
      },
      {
        label: `${sa}.otherConditions.pregnancy`,
        value: "pregnancy",
      },
    ],
    value: [],
    required: false,
    order: 14, // Incremented order
    allowOtherOptionInput: true,
    allowNoneOption: true,
  },
  {
    type: "singleOption",
    title: `${sa}.cardioFeeling.title`, // Use key
    options: [
      { label: `${sa}.cardioFeeling.likeFrequent`, value: "like_frequent" },
      { label: `${sa}.cardioFeeling.dislikeButDo`, value: "dislike_but_do" },
      { label: `${sa}.cardioFeeling.avoid`, value: "avoid_at_all_costs" },
      { label: `${sa}.cardioFeeling.depends`, value: "depends_on_type" },
    ],
    value: "",
    required: false,
    order: 15, // Incremented order
  },
  {
    type: "multipleOption",
    title: `${sa}.cardioType.title`, // Use key
    options: [
      { label: `${sa}.cardioType.walking`, value: "walking" },
      { label: `${sa}.cardioType.running`, value: "running" },
      { label: `${sa}.cardioType.stationaryBike`, value: "stationary_bike" },
      { label: `${sa}.cardioType.dance`, value: "dance" },
      { label: `${sa}.cardioType.jumpRope`, value: "jump_rope" },
      { label: `${sa}.cardioType.stairs`, value: "stairs" },
      { label: `${sa}.cardioType.swimming`, value: "swimming" },
      { label: `${sa}.cardioType.elliptical`, value: "elliptical" },
    ],
    value: [],
    required: false,
    order: 16,
    allowOtherOptionInput: true,
    allowNoneOption: true,
    standardKey: "cardioTypes",
  },
];

export default standardAnamnesisModel;
