// --- Define ExerciseReference structure ---
export interface ExerciseReference {
  id: string; // Unique ID for the exercise
  name: string; // Name of the exercise
  // Optional: Add more details if needed later
  details?: string; // e.g., "3 sets x 10 reps"
  imageUrl?: string; // Optional image/thumbnail
  lottiePath?: string; // <-- Add path to lottie file
}

// --- Define Message structure ---
export interface Message {
  id: string;
  sender: "user" | "client";
  text: string; // Keep text for context or fallback
  timestamp: Date;
  exerciseRef?: ExerciseReference; // Add the optional exercise reference
}

// --- Define Client structure for Chat ---
// In a real app, this would come from an API
export interface Client {
  id: string;
  name: string;
  avatarUrl?: string; // Optional avatar
  hasNewMessages: boolean;
  newMessageCount?: number;
  lastMessageTime: Date; // For sorting
  messages: Message[]; // Simple message store for demo
}
