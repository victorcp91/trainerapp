# TrainerApp Documentation

This document provides an overview of the TrainerApp application's functionality, screen by screen, followed by the planned data structures for its backend.

## Application Functionality Overview

This section describes the purpose and features of each main page and key components within the application.

### Authentication

- **`/login` (`src/app/login/page.tsx`)**: Allows existing users (trainers) to log in using email/password or Google Sign-In via Firebase Authentication. Redirects to the dashboard on success. Provides links to registration and password reset.
- **`/register` (`src/app/register/page.tsx`)**: Allows new users (trainers) to sign up using email/password or Google Sign-In via Firebase Authentication. Redirects to the dashboard on success. Includes fields for Full Name (currently unused in logic) and password confirmation (validation needed). Links to the login page.
- **`/forgot-password` (`src/app/forgot-password/page.tsx`)**: Allows users to request a password reset link via email using Firebase Authentication.

### Dashboard (`/dashboard`)

- **`/dashboard` (`src/app/dashboard/page.tsx`)**: The main landing page after login. Displays a welcome message, the current date, and summary cards with key metrics:
  - Active Client count (links to Client list).
  - Pending Workouts (Near Due / Overdue counts, links to filtered Client list).
  - Today's Attendance percentage.
  - Next Scheduled Session time.
  - Sections for Today's Schedule and Notifications (currently placeholder data).
- **`/dashboard/clients` (`src/app/dashboard/clients/page.tsx`)**: Manages the list of clients.
  - **Displays Clients:** Shows client information using `ClientCard` components.
  - **Filtering:** Allows filtering by name, client type, plan status, client status, and gender using `ClientFilters`.
  - **Sorting:** Allows sorting the client list.
  - **Creation/Editing:** Opens `ClientFormModal` to add a new client or edit an existing one.
    - **New Client Workflow:** When adding a new client, the modal first prompts the trainer to search for an existing user by email via an API search. If the user is found, their information might be pre-filled (or linked). If the user is not found (i.e., not registered in the system), the remaining fields in the modal become visible, allowing the trainer to enter the new client's full details for registration and creation within the trainer's client list.
  - **Scheduling:** Opens `ScheduleSessionModal` to schedule a session for a client.
  - **Cancellation:** Opens `ConfirmCancelModal` for cancelling attendance.
- **`/dashboard/clients/[id]` (`src/app/dashboard/clients/[id]/page.tsx`)**: Displays the detailed profile for a specific client.
  - **Header (`ClientProfileHeader`):** Shows name, type, active status (toggleable).
  - **Tabs:**
    - **Profile (`ProfileTabContent`):** View and add dated notes for the client.
    - **Training (`TrainingTabContent`):** View training history, navigate to create new plans, open `ReplicateTrainingModal` to duplicate existing plans.
    - **Evolution (`EvolutionTabContent`):** View dated progress photos, open `ProgressComparisonModal` for side-by-side view.
    - **Anamnesis (`AnamnesisTabContent`):** View submitted anamnesis questionnaire responses.
- **`/dashboard/clients/[id]/new-plan` (`src/app/dashboard/clients/[id]/new-plan/page.tsx`)**: Interface for creating a new training plan for a specific client.
  - **Date Range:** Set start and end dates for the plan.
  - **Daily Structure:** Displays cards (`TrainingDayCard`) for each day in the range.
  - **Exercise Management:** Add/edit exercises for each day using `ExerciseModal`.
  - **Templates:** Apply pre-defined weekly structures (`Serie Models`) or individual workout templates (`Training Models`) using `AddModelModal`.
  - **Plan Info:** Edit overall plan details using `SeriesInfoForm` and `TrainingInfoCard`.
  - **Day/Week Operations:** Clear days, replicate days (`ReplicateTrainingModal`), move days (`MoveTrainingModal`), replicate weeks.
  - **Publishing:** Allows saving the plan as a draft or publishing it.
- **`/dashboard/training-models` (`src/app/dashboard/training-models/page.tsx`)**: Manages reusable workout templates.
  - **Training Models:** List (`TrainingModelList`), filter (`TrainingModelFilters`), sort, create/edit (using `ExerciseModal`), and favorite individual workout templates.
  - **Series:** List (`SeriesList`), filter (`SeriesFilters`), sort, create (`CreateSeriesModal`), and favorite series (folders/groups) used to organize training models.
  - **Drag & Drop:** Assign Training Models to Series by dragging cards.
- **`/dashboard/anamnesis-models` (`src/app/dashboard/anamnesis-models/page.tsx`)**: Manages reusable anamnesis questionnaire templates.
  - Lists custom-created models and a standard default model.
  - Navigate to create a new model (`/new`).
  - Navigate to edit an existing model (`/[modelId]`).
  - Allows deleting models.
- **`/dashboard/anamnesis-models/new` (`src/app/dashboard/anamnesis-models/new/page.tsx`)**: Editor for creating a new anamnesis model.
  - Uses `AnamnesisModelEditor` component.
  - Can start blank or load a standard template (`?loadStandard=true`).
  - Allows defining sections, questions (various types like text, multiple choice), and other elements.
  - Handles saving the model structure.
- **`/dashboard/anamnesis-models/[modelId]` (Implicit):** Editor for modifying an existing anamnesis model (likely reuses `AnamnesisModelEditor`).
- **`/dashboard/attendances` (`src/app/dashboard/attendances/page.tsx`)**: Tracks client attendance and schedules.
  - **Calendar View (`CalendarSidebar`):** Select date to view.
  - **Daily Details (`DayDetails`):** Shows appointments for the selected date, allows check-in, marking absence (with reason modal), and canceling (with reason modal).
  - **Summary (`SummaryCards`):** Displays overall attendance statistics.
  - **Scheduling:** Add/edit appointments using `ScheduleAppointmentModal`.
  - Uses `AttendanceContext` for state management.
- **`/dashboard/chats` (`src/app/dashboard/chats/page.tsx`)**: Provides a messaging interface between trainer and clients.
  - **Client List (`ClientList`):** Shows clients, indicates unread messages, sorted by recency/unread status.
  - **Chat View (`ChatView`):** Displays message history for the selected client, allows sending new messages. Supports referencing exercises in messages.
  - Handles marking messages as read.
- **`/dashboard/account` (`src/app/dashboard/account/page.tsx`)**: Allows the logged-in trainer to manage their own profile.
  - Edit personal info (name, phone, avatar).
  - Change password.
  - View subscription/plan details (placeholder/future feature).
  - Delete account (with confirmation).
- **`/dashboard/settings` (`src/app/dashboard/settings/page.tsx`)**: Configures application settings.
  - Currently allows changing the display language (EN/PT).

---

# TrainerApp Data Structure Documentation

This document outlines the planned data structures for the TrainerApp application, based on the analysis of its pages and functionalities. These structures are designed with a NoSQL database like Firestore in mind.

## Core Collections

### 1. `users`

Represents trainers (and potentially clients if they need to log in). Linked to Firebase Authentication.

- `uid` (string, PK): Unique ID from Firebase Authentication.
- `email` (string): User's email address (from Auth).
- `fullName` (string): User's full name.
- `phone` (string, optional): User's phone number.
- `avatarUrl` (string, optional): URL for the user's profile picture.
- `role` (string): User role ('trainer' or 'client').
- `authProvider` (string): Authentication provider used (e.g., 'password', 'google.com').
- `createdAt` (timestamp): Timestamp of user creation.
- `preferredLocale` (string, optional): User's preferred language ('en', 'pt', etc.).

### 2. `clients`

Represents the clients managed by a trainer.

- `clientId` (string, PK): Unique ID for the client.
- `trainerUid` (string, FK -> `users.uid`): The UID of the trainer managing this client.
- `name` (string): Client's full name.
- `email` (string, optional): Client's email address.
- `phone` (string, optional): Client's phone number.
- `status` (string): Client status ('active', 'inactive').
- `clientType` (string): How the client is trained ('online', 'in_person', 'hybrid').
- `gender` (string, optional): Client's gender.
- `dateOfBirth` (date/timestamp, optional): Client's date of birth.
- `notes` (array of objects, optional): Dated notes about the client.
  - Object Structure: `{ date: timestamp, text: string }`
- `registrationDate` (timestamp): When the client was added.
- `avatarUrl` (string, optional): URL for the client's profile picture.
- `latestPlanId` (string, optional, FK -> `training_plans.planId`): _Denormalized_ ID of the most recent plan for quick access/display.
- `latestPlanStatus` (string, optional): _Denormalized_ status of the most recent plan for quick access/display.

### 3. `training_plans`

Represents specific training programs assigned to clients, defining workouts for a date range.

- `planId` (string, PK): Unique ID for the training plan.
- `clientId` (string, FK -> `clients.clientId`): The client this plan is for.
- `trainerUid` (string, FK -> `users.uid`): The trainer who created the plan.
- `name` (string): Name of the training plan (e.g., "Phase 1 Hypertrophy").
- `startDate` (date/timestamp): Start date of the plan.
- `endDate` (date/timestamp): End date of the plan.
- `status` (string): Current status ('draft', 'published', 'archived', 'completed').
- `level` (string, optional): Difficulty level (e.g., 'beginner', 'intermediate', 'advanced').
- `dailyWorkouts` (map): Contains exercises assigned to specific dates within the plan's range.
  - Key: Date string "YYYY-MM-DD".
  - Value: Array of `Exercise` objects.
  - `Exercise` Object: `{ exerciseModelId?: string, name: string, series: number, reps: string | number, restTime: number, advancedTechnique?: string, notes?: string, muscleGroup?: string, order?: number }`
- `createdAt` (timestamp): Timestamp of plan creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 4. `sessions` (or `appointments`)

Represents scheduled appointments or logged training sessions.

- `sessionId` (string, PK): Unique ID for the session/appointment.
- `clientId` (string, FK -> `clients.clientId`): The client involved.
- `trainerUid` (string, FK -> `users.uid`): The trainer involved.
- `startTime` (timestamp): Scheduled start date and time.
- `endTime` (timestamp): Scheduled end date and time.
- `status` (string): Status ('scheduled', 'completed', 'absent', 'canceled').
- `checkInTime` (timestamp, optional): Actual check-in time if applicable.
- `absenceReason` (string, optional): Reason if marked absent.
- `cancellationReason` (string, optional): Reason if canceled.
- `locationName` (string, optional): Name of the location (e.g., "Gym X", "Online").
- `locationAddress` (string, optional): Full address if applicable.
- `notes` (string, optional): Any notes specific to this session.
- `createdAt` (timestamp): Timestamp of session creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 5. `training_models`

Represents reusable templates for individual workouts (e.g., "Leg Day").

- `modelId` (string, PK): Unique ID for the training model.
- `trainerUid` (string, FK -> `users.uid`): The trainer who owns this model.
- `name` (string): Name of the workout model.
- `description` (string, optional): Description of the model.
- `exercises` (array of `Exercise` objects): The list of exercises in this workout template. (See `training_plans.dailyWorkouts.Exercise` for structure).
- `level` (string, optional): Suggested difficulty level.
- `muscleGroups` (array of strings, optional): Primary muscle groups targeted.
- `isFavorite` (boolean): Flag if the trainer marked it as a favorite.
- `createdAt` (timestamp): Timestamp of model creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 6. `training_series`

Represents reusable, user-created folders or groups used to organize individual `training_models`. These are managed on the "Training Models" page (`/dashboard/training-models`). The primary purpose is organizational (e.g., grouping models by phase, muscle group, or custom category).

- `seriesId` (string, PK): Unique ID for the training series (folder/group).
- `trainerUid` (string, FK -> `users.uid`): The trainer who owns this series.
- `name` (string): Name of the series/folder (e.g., "Beginner Phase", "Push Days").
- `description` (string, optional): Description of the series/folder.
- `level` (string, optional): Suggested difficulty level associated with the group.
- `modelIds` (array of strings, FKs -> `training_models.modelId`): Ordered list of training model IDs contained within this series/folder.
- `isFavorite` (boolean): Flag if the trainer marked this series/folder as a favorite.
- `createdAt` (timestamp): Timestamp of series creation.
- `updatedAt` (timestamp): Timestamp of last update.

_**Note:** This collection should not be confused with the hardcoded "Serie Models" (e.g., "Treino A", "Treino B") used within the "New Plan" page (`/dashboard/clients/[id]/new-plan`). Those represent predefined weekly workout structures/splits and are currently implemented directly in the frontend logic. If those preset structures become user-editable in the future, they might warrant their own collection or be integrated differently._

### 7. `anamnesis_models`

Represents reusable templates for anamnesis questionnaires.

- `modelId` (string, PK): Unique ID for the anamnesis model.
- `trainerUid` (string, FK -> `users.uid`): The trainer who owns this model.
- `name` (string): Name of the questionnaire model.
- `description` (string, optional): Description of the model.
- `isStandard` (boolean, optional): Flag if this is a system-provided standard model.
- `structure` (array of objects): Ordered list defining the questionnaire sections and questions.
  - Element Object Example: `{ elementId: string, type: string ('section_header', 'text', 'textarea', 'radio', 'checkbox', 'select', 'welcome'), text?: string, title?: string, options?: {value: string, label: string}[], isRequired?: boolean, ... }` (Specific fields depend on `type`).
- `createdAt` (timestamp): Timestamp of model creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 8. `anamnesis_responses`

Stores a client's submitted answers to a specific `anamnesis_model`.

- `responseId` (string, PK): Unique ID for the submitted response.
- `clientId` (string, FK -> `clients.clientId`): The client who submitted the response.
- `trainerUid` (string, FK -> `users.uid`): The trainer associated with the client.
- `modelId` (string, FK -> `anamnesis_models.modelId`): The model used for this response.
- `submissionDate` (timestamp): When the response was submitted.
- `answers` (map): Stores the answers provided by the client.
  - Key: `elementId` from the `anamnesis_models.structure`.
  - Value: The answer provided (string, number, boolean, array of strings, etc., depending on question type).
- **Assigning Models:** The process of assigning a specific `anamnesis_model` to a `client` needs to be defined (e.g., a button on the client profile's Anamnesis tab triggers assignment, potentially creating a pending `anamnesis_response` entry).
- **Client Submission:** The workflow for how the client receives the notification/link to the assigned questionnaire and how they fill it out within their own (currently separate) client-facing app needs to be detailed. The submission would populate the `answers` field in the corresponding `anamnesis_responses` document.

### 9. `progress_photos`

Stores sets of dated progress photos for clients.

- `photoSetId` (string, PK): Unique ID for this set of photos.
- `clientId` (string, FK -> `clients.clientId`): The client these photos belong to.
- `trainerUid` (string, FK -> `users.uid`): The trainer associated with the client.
- `date` (date/timestamp): The date these photos were taken.
- `frontPhotoUrl` (string): URL of the front-view photo.
- `sidePhotoUrl` (string): URL of the side-view photo.
- `backPhotoUrl` (string): URL of the back-view photo.
- `notes` (string, optional): Any notes specific to this set of photos.
- `createdAt` (timestamp): Timestamp when the photos were uploaded.

### 10. `chats`

Represents a single conversation thread between a trainer and a client.

- `chatId` (string, PK): Unique ID for the chat thread.
- `trainerUid` (string, FK -> `users.uid`): Participant trainer UID.
- `clientId` (string, FK -> `clients.clientId`): Participant client ID.
- `lastMessageTimestamp` (timestamp): Timestamp of the most recent message (for sorting).
- `lastMessageText` (string, optional): Snippet of the last message (for preview).
- `trainerUnreadCount` (number): Count of messages unread by the trainer in this chat.
- `clientUnreadCount` (number): Count of messages unread by the client in this chat.
- `participants` (array of strings): List of participant IDs (`trainerUid`, `clientId`) for querying.

### 11. `messages`

Stores individual messages belonging to a chat thread.

- `messageId` (string, PK): Unique ID for the message.
- `chatId` (string, FK -> `chats.chatId`): The chat thread this message belongs to.
- `senderUid` (string, FK -> `users.uid` or potentially `clients.authUid`): The UID of the message sender.
- `senderType` (string): Type of sender ('trainer' or 'client').
- `text` (string): The content of the message.
- `timestamp` (timestamp): When the message was sent.
- `exerciseRef` (object, optional): Reference to a specific exercise mentioned in the chat.
  - Object Structure: `{ exerciseId?: string, exerciseName: string, details: string }`
- `isRead` (boolean, optional): _Alternative read status tracking, potentially less scalable than counts in `chats`._

### 12. `subscriptions`

Tracks the subscription plan details for trainers.

- `subscriptionId` (string, PK): Unique ID for the subscription record.
- `trainerUid` (string, FK -> `users.uid`): The trainer this subscription belongs to.
- `planId` (string): Identifier for the specific plan level (e.g., 'free', 'premium_monthly').
- `status` (string): Current status ('active', 'trialing', 'past_due', 'canceled', 'expired').
- `startDate` (timestamp): When the subscription period started.
- `endDate` (timestamp, optional): When the subscription period ends (for non-renewing plans).
- `trialEndDate` (timestamp, optional): When the trial period ends.
- `renewalDate` (timestamp, optional): Next billing date for auto-renewing plans.
- `renewalType` (string): How the plan renews ('auto', 'manual').
- `paymentProviderId` (string, optional): ID from the payment provider (e.g., Stripe Customer/Subscription ID).

---

This structure provides a foundation for building the application's backend API and database interactions. Adjustments may be needed as development progresses.
