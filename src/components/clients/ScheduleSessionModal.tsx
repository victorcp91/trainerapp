import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Modal,
  Grid,
  Text,
  Select,
  TextInput,
  Textarea,
  MultiSelect,
  Button,
  Group,
  Box,
  Stack,
  Card,
  Flex,
  ActionIcon,
  Tooltip,
  Title,
} from "@mantine/core";
import { DatesProvider, Calendar } from "@mantine/dates";
import { IconAlertCircle, IconAlertTriangle, IconX } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { Client } from "@/types/client";
import { ScheduleSubmitData } from "@/types/attendances"; // Import from types

// --- Helper Functions (Consider moving to utils) ---
function timeStringToMinutes(time: string): number {
  if (!time || !time.includes(":")) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function intervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeStringToMinutes(startA);
  const aEnd = timeStringToMinutes(endA);
  const bStart = timeStringToMinutes(startB);
  const bEnd = timeStringToMinutes(endB);
  return aStart < bEnd && bStart < aEnd;
}
// --- End Helper Functions ---

interface Option {
  value: string;
  label: string;
}

interface Interval {
  start: string;
  end: string;
  clientName: string;
  location?: string;
}

interface Attendance {
  clientId: string;
  date: string;
  times: [string, string];
  location?: string;
}

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleSubmitData) => void;
  client: Client | null;
  attendances: Attendance[]; // Pass full attendances for interval calculation
  timeSlots: Option[];
  weekDaysOptions: Option[];
  occupiedDates: Date[]; // Pass pre-calculated occupied dates for calendar rendering
  onInitiateCancel: (details: { idx: number; interval: Interval }) => void; // To open confirmation modal
  t: (key: string, params?: Record<string, React.ReactNode>) => string;
  tCommon: (key: string) => string;
  format: {
    dateTime: (
      date: Date,
      options?: Record<string, string | number | boolean>
    ) => string;
  };
}

const ScheduleSessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  attendances,
  timeSlots,
  weekDaysOptions,
  occupiedDates,
  onInitiateCancel,
  t,
  tCommon,
  format,
}: ScheduleSessionModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

  const locationInputRef = useRef<HTMLInputElement | null>(null);

  // Reset state when modal opens or client changes
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setStartTime(null);
      setEndTime(null);
      setLocation("");
      setObservation("");
      setRecurrenceDays([]);
      setIsSubmittingSchedule(false);
    } else {
      // Optional: Clear ref if needed, though might not be necessary
      // locationInputRef.current = null;
    }
  }, [isOpen, client]);

  // Google Places Autocomplete Initialization
  useEffect(() => {
    if (
      !isOpen ||
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      !locationInputRef.current
    ) {
      // Silently return if API isn't ready or modal isn't open
      return;
    }

    let autocomplete: google.maps.places.Autocomplete | null = null;
    try {
      autocomplete = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "br" }, // Example restriction
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete?.getPlace();
        if (place) {
          setLocation(place.formatted_address || place.name || "");
        }
      });

      // Cleanup function to remove the listener
      return () => {
        if (autocomplete) {
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
      // Potentially show a user-facing error or disable the feature
    }

    // Re-run effect if isOpen changes to re-attach listener when modal re-opens
    // locationInputRef should be stable, but include if needed
  }, [isOpen]);

  // Calculate occupied intervals for the selected date
  const occupiedIntervals = useMemo(() => {
    if (!selectedDate) return [];
    const selectedDateStr = selectedDate.toISOString().slice(0, 10);

    // Need client data accessible here to get names
    // This assumes parent passes necessary client data or we fetch/find it here
    // For now, let's assume a function findClientNameById exists or is passed
    // Placeholder: Fetch client data if needed
    const findClientNameById = (id: string) =>
      clientsData.find((c) => c.id === id)?.name || "Unknown Client";
    const clientsData = attendances.map((a) => ({
      id: a.clientId,
      name: "Client " + a.clientId,
    })); // Example placeholder

    return attendances
      .filter((a) => a.date === selectedDateStr)
      .map((a) => ({
        start: a.times[0],
        end: a.times[1],
        clientName: findClientNameById(a.clientId),
        location: a.location || undefined,
      }))
      .sort(
        (a, b) => timeStringToMinutes(a.start) - timeStringToMinutes(b.start)
      );
  }, [selectedDate, attendances]);

  // Calendar day renderer function
  function renderDay(date: Date) {
    const day = date.getDate();
    const dateStr = date.toISOString().slice(0, 10);
    const isOccupied = occupiedDates.some(
      (occupiedDate) => occupiedDate.toISOString().slice(0, 10) === dateStr
    );

    // Basic styling for occupied days
    const style: React.CSSProperties = isOccupied ? { color: "orange" } : {};

    return (
      <Tooltip
        label={isOccupied ? t("scheduleModal.occupiedDayTooltip") : undefined}
        position="top"
        withArrow
        disabled={!isOccupied}
      >
        <div style={style}>{day}</div>
      </Tooltip>
    );
  }

  const handleInternalSubmit = () => {
    if (!selectedDate || !startTime || !endTime || !location || !client) {
      showNotification({
        title: tCommon("error"),
        message: t("scheduleModal.validation.fillAllFields"),
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
      return;
    }

    const hasOverlap = occupiedIntervals.some((interval) =>
      intervalsOverlap(startTime, endTime, interval.start, interval.end)
    );

    if (hasOverlap) {
      showNotification({
        title: t("scheduleModal.validation.overlapTitle"),
        message: t("scheduleModal.validation.overlapMessage"),
        color: "orange",
        icon: <IconAlertTriangle size={18} />,
      });
      return;
    }

    setIsSubmittingSchedule(true);
    const scheduleData: ScheduleSubmitData = {
      clientId: client.id,
      date: selectedDate.toISOString().slice(0, 10),
      times: [startTime, endTime],
      location,
      observation,
      recurrenceDays,
    };

    // Call the onSubmit prop passed from the parent
    onSubmit(scheduleData);

    // Parent will handle notification and closing the modal upon success
    // Resetting submitting state might happen in parent or here after onSubmit promise resolves
    // For simplicity, let's assume parent handles it.
    // setIsSubmittingSchedule(false); // Or handle this based on onSubmit outcome
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("scheduleModal.title")}
      size="xl"
    >
      {client && (
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text fw={500} mb="xs">
              {t("scheduleModal.clientLabel")}: {client.name}
            </Text>
            <DatesProvider settings={{ locale: "pt-br", firstDayOfWeek: 0 }}>
              <Calendar
                getDayProps={(date) => ({
                  selected:
                    selectedDate?.toDateString() === date.toDateString(),
                  onClick: () => setSelectedDate(date),
                  style: () => ({}), // Keep empty style for renderDay logic
                })}
                renderDay={renderDay}
                minDate={new Date()} // Optional: Prevent scheduling in the past
              />
            </DatesProvider>

            {selectedDate && (
              <Box mt="lg">
                <Title order={5} mb="sm">
                  {t("scheduleModal.existingSchedulesTitle", {
                    date: selectedDate
                      ? format.dateTime(selectedDate, {
                          dateStyle: "medium",
                        })
                      : "",
                  })}
                </Title>
                {occupiedIntervals.length > 0 ? (
                  <Stack gap="xs">
                    {occupiedIntervals.map((interval, idx) => (
                      <Card key={idx} padding="xs" radius="sm" withBorder>
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text size="sm">
                              {interval.start} - {interval.end}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {interval.clientName}
                            </Text>
                            {interval.location && (
                              <Text size="xs" c="dimmed">
                                {interval.location}
                              </Text>
                            )}
                          </Box>
                          <Tooltip
                            label={t("scheduleModal.cancelAttendanceButton")}
                            withArrow
                          >
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() =>
                                onInitiateCancel({ idx, interval })
                              }
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Flex>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    {t("scheduleModal.noSchedules")}
                  </Text>
                )}
              </Box>
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Select
                label={t("scheduleModal.startTimeLabel")}
                placeholder={t("scheduleModal.startTimePlaceholder")}
                data={timeSlots}
                value={startTime}
                onChange={setStartTime}
                searchable
                required
                disabled={!selectedDate}
              />
              <Select
                label={t("scheduleModal.endTimeLabel")}
                placeholder={t("scheduleModal.endTimePlaceholder")}
                data={timeSlots.filter(
                  (slot) =>
                    !startTime ||
                    timeStringToMinutes(slot.value) >
                      timeStringToMinutes(startTime)
                )}
                value={endTime}
                onChange={setEndTime}
                searchable
                required
                disabled={!startTime}
              />
              <TextInput
                label={t("scheduleModal.locationLabel")}
                placeholder={t("scheduleModal.locationPlaceholder")}
                ref={locationInputRef}
                value={location}
                onChange={(e) => setLocation(e.currentTarget.value)}
                required
                disabled={!selectedDate}
              />
              <Textarea
                label={t("scheduleModal.observationLabel")}
                placeholder={t("scheduleModal.observationPlaceholder")}
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.currentTarget.value)}
                disabled={!selectedDate}
              />
              <MultiSelect
                label={t("scheduleModal.recurrenceLabel")}
                placeholder={t("scheduleModal.recurrencePlaceholder")}
                data={weekDaysOptions}
                value={recurrenceDays}
                onChange={setRecurrenceDays}
                disabled={!selectedDate}
                clearable
              />
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={onClose}>
                  {tCommon("cancel")}
                </Button>
                <Button
                  onClick={handleInternalSubmit}
                  disabled={
                    !selectedDate ||
                    !startTime ||
                    !endTime ||
                    !location ||
                    isSubmittingSchedule
                  }
                  loading={isSubmittingSchedule}
                >
                  {recurrenceDays.length > 0
                    ? t("scheduleModal.addRecurrenceButton")
                    : t("scheduleModal.addButton")}
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      )}
    </Modal>
  );
};

export default ScheduleSessionModal;
