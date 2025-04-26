# TrainerApp Documentation

This document provides an overview of the TrainerApp application's functionality, screen by screen, followed by the planned data structures for its backend, focusing on aspects relevant for database design.

## Application Functionality Overview

This section describes the purpose and features of each main page and key components within the application.

### Authentication

- **`/login` (`src/app/login/page.tsx`)**: Allows existing users (trainers) to log in using email/password or Google Sign-In via Firebase Authentication. Redirects to the dashboard on success. Provides links to registration and password reset.
- **`/register` (`src/app/register/page.tsx`)**: Allows new users (trainers) to sign up using email/password or Google Sign-In via Firebase Authentication. Redirects to the dashboard on success. Includes fields for Full Name and password confirmation. Links to the login page.
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
    - **New Client Workflow:** When adding a new client, the modal first prompts the trainer to search for an existing user by email. If the user is found, their information might be pre-filled. If not found, the trainer can enter the new client's details for registration/creation.
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
  - **Exercise Management:** Add/edit exercises for each day using `ExerciseModal` (supports strength, steady aerobic, HIIT, and stretching types).
  - **Templates:** Apply pre-defined weekly structures (`Series` - folders of `Training Models`) or individual workout templates (`Training Models`) using `AddModelModal`.
  - **Plan Info:** Edit overall plan details using `SeriesInfoForm` and `TrainingInfoCard`.
  - **Day/Week Operations:** Clear days, replicate days (`ReplicateTrainingModal`), move days (`MoveTrainingModal`), replicate weeks.
  - **Publishing:** Allows saving the plan as a draft or publishing it.
- **`/dashboard/training-models` (`src/app/dashboard/training-models/page.tsx`)**: Manages reusable workout templates.
  - **Training Models:** List (`TrainingModelList`), filter (`TrainingModelFilters`), sort, create/edit (using `ExerciseModal` supporting strength, aerobic, and stretching), and favorite individual workout templates.
  - **Series:** List (`SeriesList`), filter (`SeriesFilters`), sort, create (`CreateSeriesModal`), and favorite series (folders/groups) used to organize training models.
  - **Drag & Drop:** Assign Training Models to Series by dragging cards.
- **`/dashboard/anamnesis-models` (`src/app/dashboard/anamnesis-models/page.tsx`)**: Manages reusable anamnesis questionnaire templates.
  - Lists custom-created models and a standard default model.
  - Navigate to create a new model (`/new`).
  - Navigate to edit an existing model (`/[modelId]`).
  - Allows deleting models.
- **`/dashboard/anamnesis-models/new` (`src/app/dashboard/anamnesis-models/new/page.tsx`)**: Editor for creating a new anamnesis model.
  - Uses `AnamnesisModelEditor` component.
  - Can start blank or load a standard template (`defaultAnamnesisModel.ts`).
  - Allows defining sections and questions (various types: welcome, text, date, singleOption, multipleOption, metric, bodyParts, injury).
  - Handles saving the model structure.
- **`/dashboard/anamnesis-models/[modelId]` (Implicit):** Editor for modifying an existing anamnesis model (reuses `AnamnesisModelEditor`).
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
  - Allows changing the display language (EN/PT).

---

# TrainerApp Data Structure Documentation

This document outlines the planned data structures for the TrainerApp application, based on the analysis of its pages, components, and types. These structures are designed with a NoSQL database like Firestore in mind.

## Core Collections

### 1. `users`

Represents registered users (primarily trainers, but potentially clients if they need app access). Linked to Firebase Authentication.

- **`uid`** (string, PK): Unique ID from Firebase Authentication.
- `email` (string): User's email address (from Auth, required).
- `fullName` (string): User's full name.
- `phone` (string, optional): User's phone number.
- `avatarUrl` (string, optional): URL for the user's profile picture.
- `role` (string): User role (e.g., 'trainer'). _If clients need to log in, 'client' role would be added._
- `authProvider` (string): Authentication provider used (e.g., 'password', 'google.com').
- `createdAt` (timestamp): Timestamp of user creation.
- `preferredLocale` (string, optional): User's preferred language ('en', 'pt', etc.).

### 2. `trainers`

Stores trainer-specific profile information, potentially including settings or links to their specific resources.

- **`trainerUid`** (string, PK, FK -> `users.uid`): Unique ID matching the user record.
- `settings` (map, optional): Trainer-specific settings (e.g., default currency, notification preferences).
- `planDetails` (map, optional): Information about the trainer's subscription plan.

### 3. `clients`

Represents the clients managed by a trainer.

- **`clientId`** (string, PK): Unique ID for the client.
- `trainerUid` (string, FK -> `users.uid`): The UID of the trainer managing this client.
- `userUid` (string, optional, FK -> `users.uid`): If the client is also a registered user, link to their user record.
- `name` (string): Client's full name (required).
- `email` (string, optional): Client's email address.
- `phone` (string, optional): Client's phone number.
- `status` (string): Client status ('active', 'inactive').
- `clientType` (string): How the client is trained ('online', 'in_person', 'hybrid').
- `gender` (string, optional): Client's gender ('male', 'female', 'other').
- `dateOfBirth` (date/timestamp, optional): Client's date of birth.
- `notes` (array of objects, optional): Dated notes about the client.
  - _Object Structure:_ `{ date: timestamp, text: string }`
- `tags` (array of strings, optional): Tags or objectives assigned by the trainer (e.g., ['weight_loss', 'beginner']).
- `registrationDate` (timestamp): When the client was added by the trainer.
- `avatarUrl` (string, optional): URL for the client's profile picture.
- `assignedAnamnesisModelId` (string, optional, FK -> `anamnesis_models.modelId`): ID of the anamnesis model assigned to this client.
- `lastAnamnesisResponseId` (string, optional, FK -> `anamnesis_responses.responseId`): _Denormalized_ ID of the latest submitted anamnesis.
- `latestPlanId` (string, optional, FK -> `training_plans.planId`): _Denormalized_ ID of the most recent plan.
- `latestPlanStatus` (string, optional): _Denormalized_ status of the most recent plan (e.g., 'on_track', 'near_due', 'overdue').

### 4. `training_plans`

Represents specific training programs assigned to clients, defining workouts for a date range.

- **`planId`** (string, PK): Unique ID for the training plan.
- `clientId` (string, FK -> `clients.clientId`): The client this plan is for.
- `trainerUid` (string, FK -> `users.uid`): The trainer who created the plan.
- `name` (string): Name of the training plan (e.g., "Phase 1 Hypertrophy").
- `description` (string, optional): Description of the plan.
- `startDate` (date/timestamp): Start date of the plan.
- `endDate` (date/timestamp): End date of the plan.
- `status` (string): Current status ('draft', 'published', 'archived', 'completed').
- `level` (string, optional): Difficulty level (e.g., 'beginner', 'intermediate', 'advanced').
- `dailyWorkouts` (map): Contains exercises assigned to specific dates within the plan's range.
  - _Key:_ Date string "YYYY-MM-DD".
  - _Value:_ Array of `Exercise` objects (see structure below).
- `createdAt` (timestamp): Timestamp of plan creation.
- `updatedAt` (timestamp): Timestamp of last update.

#### `Exercise` Object Structure (within `training_plans` and `training_models`)

Based on `src/types/training.ts` and `ExerciseModal.tsx`:

- `id` (string): Unique identifier for this specific instance of the exercise within the plan/model (e.g., UUID or temporary ID `temp-X` generated client-side, potentially persisted or replaced on save).
- `name` (string): Name of the exercise (e.g., "Bench Press").
- `notes` (string, optional): Specific notes for this exercise.
- `order` (number, optional): Order of the exercise within the workout day.
- `type` (string, required): Type of exercise ('strength', 'steady_aerobic', 'hiit_aerobic', or 'stretching').

_**Strength Fields:**_

- `series` (number, optional): Number of sets.
- `reps` (number | string, optional): Number of repetitions (or 'F'/'failure').
- `restTime` (number, optional): Rest time in seconds between sets.
- `advancedTechnique` (string, optional): E.g., 'Drop-set', 'Bi-set'.

_**Steady Aerobic Fields:**_

- `duration` (number, optional): Duration in minutes.
- `distance` (number, optional): Distance in kilometers.
- `intensity` (string, optional): E.g., 'low', 'medium', 'high'.

_**HIIT Fields:**_

- `hiitWorkTime` (number, optional): Work interval in seconds.
- `hiitRestTime` (number, optional): Rest interval in seconds.
- `hiitRounds` (number, optional): Number of rounds.

_**Stretching Fields:**_

- `holdTime` (number, optional): Duration to hold the stretch in seconds.
- `repetitions` (number, optional): Number of times to perform the stretch (often 1, but allows for reps).

_**Note:** A single exercise object will typically only populate one set of the specific fields (Strength, Steady Aerobic, HIIT, or Stretching), determined by the `type` field._

### 5. `sessions` (or `appointments`)

Represents scheduled appointments or logged training sessions.

- **`sessionId`** (string, PK): Unique ID for the session/appointment.
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
- `recurrenceRule` (string, optional): Rule for recurring sessions (e.g., RRULE string, or simple days array ['monday', 'wednesday']).
- `recurrenceParentId` (string, optional): If part of a recurrence, ID of the parent/template session.
- `createdAt` (timestamp): Timestamp of session creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 6. `training_models`

Represents reusable templates for individual workouts (e.g., "Leg Day A").

- **`modelId`** (string, PK): Unique ID for the training model.
- `trainerUid` (string, FK -> `users.uid`): The trainer who owns this model.
- `name` (string): Name of the workout model (required).
- `description` (string, optional): Description of the model.
- `exercises` (array of `Exercise` objects): Ordered list of exercises. (See `Exercise` Object Structure above).
- `level` (string, optional): Suggested difficulty level.
- `muscleGroups` (array of strings, optional): Primary muscle groups targeted (derived from exercises or manually set).
- `isFavorite` (boolean, default: false): Flag if the trainer marked it as a favorite.
- `createdAt` (timestamp): Timestamp of model creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 7. `training_series`

Represents reusable, user-created folders or groups used to organize individual `training_models`.

- **`seriesId`** (string, PK): Unique ID for the training series (folder/group).
- `trainerUid` (string, FK -> `users.uid`): The trainer who owns this series.
- `name` (string): Name of the series/folder (e.g., "Beginner Phase", "Push Days") (required).
- `description` (string, optional): Description of the series/folder.
- `level` (string, optional): Suggested difficulty level associated with the group.
- `trainingModelIds` (array of strings, FKs -> `training_models.modelId`): Ordered list of training model IDs contained within this series/folder.
- `isFavorite` (boolean, default: false): Flag if the trainer marked this series/folder as a favorite.
- `createdAt` (timestamp): Timestamp of series creation.
- `updatedAt` (timestamp): Timestamp of last update.

### 8. `anamnesis_models`

Represents reusable templates for anamnesis questionnaires.

- **`modelId`** (string, PK): Unique ID for the anamnesis model.
- `trainerUid` (string, FK -> `users.uid`, optional): The trainer who owns this model. Null/absent for standard models.
- `name` (string): Name of the questionnaire model (required).
- `description` (string, optional): Description of the model.
- `isStandard` (boolean, default: false): Flag if this is a system-provided standard model.
- `structure` (array of `IQuestion` objects): Ordered list defining the questionnaire structure. (See `IQuestion` structure below).
- `createdAt` (timestamp): Timestamp of model creation.
- `updatedAt` (timestamp): Timestamp of last update.

#### `IQuestion`
