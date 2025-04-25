export type Client = {
  id: string;
  name: string;
  age: number | null; // Age can be null if calculation fails or date is missing
  gender: string;
  email: string;
  phone: string;
  tags: string[];
  status: string; // e.g., 'active', 'inactive'
  type: string; // e.g., 'online', 'in_person', 'hybrid'
  profilePicture: string;
  startDate?: string; // Consider if this should be birthDate if used for age calculation
  planStatus: string; // e.g., 'on_track', 'near_due', 'overdue'
  avatar: string;
  lastTraining?: string; // Optional last training date
  nextTraining?: string; // Optional next training date
};

// Define the structure for form values explicitly
export interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  birthDate: Date | null; // Note: API/DB might store as string
  gender: string | null;
  type: string | null;
  tags: string[];
  observations: string;
}
