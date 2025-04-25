// src/types/attendances.ts
export interface Appointment {
  id: number;
  client: string; // Consider using client ID for value
  address: string; // May be derived from location or specific instruction
  startTime: string; // ISO String
  endTime: string; // ISO String
  avatar: string; // URL or path
  location?: AppointmentLocation | null; // Optional detailed location
  observation?: string; // Optional notes
  // Add status?: 'scheduled' | 'completed' | 'canceled' | 'absent';
}

// Define AppointmentLocation if not defined elsewhere
export interface AppointmentLocation {
  name: string;
  formatted_address: string;
  place_id: string;
}

export interface ClientOption {
  value: string;
  label: string;
}

// Add other related types if needed

export interface ScheduleDetails {
  client: string | null; // Client ID
  date: Date | null;
  startTime: string | null; // Format HH:MM
  endTime: string | null; // Format HH:MM
  location: AppointmentLocation | null; // Reuse existing location type
  details: string; // Corresponds to 'observation' perhaps?
  recurrence: string[]; // e.g., ['weekly', 'monday'] - adjust as needed
}

// Data structure for submitting a new schedule/attendance
export interface ScheduleSubmitData {
  clientId: string;
  date: string; // YYYY-MM-DD format
  times: [string, string]; // [HH:MM, HH:MM]
  location: string;
  observation: string;
  recurrenceDays: string[]; // Array of weekday numbers/identifiers (e.g., ['1', '3'] for Mon, Wed)
}
