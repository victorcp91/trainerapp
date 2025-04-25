import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { Appointment, ClientOption } from "@/types/attendances"; // Assuming types are defined here

// Define the shape of the context state
interface AttendanceState {
  selectedDate: Date | null;
  appointments: Appointment[];
  clientData: ClientOption[]; // Assuming ClientOption is { value: string; label: string; }
  // Add derived state if needed, e.g., daily stats, though calculation in components might be simpler
}

// Define the shape of the context actions
interface AttendanceActions {
  setSelectedDate: (date: Date | null) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (updatedAppointment: Appointment) => void;
  deleteAppointment: (appointmentId: number) => void;
  markAbsence: (appointmentId: number, reason: string) => void; // Example action
  checkIn: (appointmentId: number) => void; // Example action
}

// Combine state and actions for the context value
type AttendanceContextType = AttendanceState & AttendanceActions;

// Create the context with a default value (can be undefined or null, checked on consumption)
const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

// Define the Props for the Provider component
interface AttendanceProviderProps {
  children: ReactNode;
  initialAppointments?: Appointment[]; // Allow passing initial data
  initialClientData?: ClientOption[];
}

// Create the Provider component
export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({
  children,
  initialAppointments = [],
  initialClientData = [],
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [clientData, _setClientData] =
    useState<ClientOption[]>(initialClientData); // Assuming clientData is relatively static for now

  // --- Actions ---

  const addAppointment = useCallback((newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
    // TODO: Add API call to persist
    console.log("Context: Adding Appointment", newAppointment);
  }, []);

  const updateAppointment = useCallback((updatedAppointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === updatedAppointment.id ? updatedAppointment : app
      )
    );
    // TODO: Add API call to persist
    console.log("Context: Updating Appointment", updatedAppointment);
  }, []);

  const deleteAppointment = useCallback((appointmentId: number) => {
    setAppointments((prev) => prev.filter((app) => app.id !== appointmentId));
    // TODO: Add API call to persist (for cancellation)
    console.log("Context: Deleting Appointment", appointmentId);
  }, []);

  const markAbsence = useCallback((appointmentId: number, reason: string) => {
    // TODO: Implement actual absence logic (API call + state update if status changes)
    console.log(
      `Context: Marking Absence for ${appointmentId}, Reason: ${reason}`
    );
    // Example state update if appointments have a status field:
    // setAppointments((prev) =>
    //   prev.map((app) =>
    //     app.id === appointmentId ? { ...app, status: 'absent' } : app
    //   )
    // );
  }, []);

  const checkIn = useCallback((appointmentId: number) => {
    // TODO: Implement actual check-in logic (API call + state update if status changes)
    console.log(`Context: Checking In ${appointmentId}`);
    // Example state update:
    // setAppointments((prev) =>
    //   prev.map((app) =>
    //     app.id === appointmentId ? { ...app, status: 'completed' } : app
    //   )
    // );
  }, []);

  // Value provided by the context
  const value: AttendanceContextType = {
    selectedDate,
    appointments,
    clientData,
    setSelectedDate,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    markAbsence,
    checkIn,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook to use the AttendanceContext
export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
