import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Flex,
  Title,
  Select,
  Group,
  Text,
  MultiSelect,
  Button,
} from "@mantine/core";
import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useAttendance } from "@/contexts/AttendanceContext"; // Import context hook
import { AppointmentLocation, ScheduleDetails } from "@/types/attendances"; // Remove unused ClientOption
import { useTranslations } from "next-intl";

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (details: ScheduleDetails) => void; // Keep callback for scheduling
  renderDay: DatePickerProps["renderDay"]; // Keep renderDay
  initialData?: ScheduleDetails | undefined; // Use ScheduleDetails directly for initialData
}

// Helper to format time string (HH:MM) from Date object or existing string
const formatTime = (dateOrString: Date | string | null | undefined): string => {
  if (!dateOrString) return "";
  if (typeof dateOrString === "string") {
    // Check if it's already HH:mm
    if (/^\d{2}:\d{2}$/.test(dateOrString)) return dateOrString;
    // Otherwise, assume it's an ISO string or similar Date string
    try {
      return new Date(dateOrString).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ""; // Handle invalid date strings gracefully
    }
  }
  // If it's a Date object
  return dateOrString.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  renderDay,
  initialData,
}) => {
  const t = useTranslations();
  // Get context data
  const { selectedDate, setSelectedDate, clientData } = useAttendance();

  // Local state for the form, initialized from initialData or defaults
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date | null>(
    selectedDate
  );
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [appointmentStartTime, setAppointmentStartTime] = useState<string>("");
  const [appointmentEndTime, setAppointmentEndTime] = useState<string>("");
  const [appointmentLocation, setAppointmentLocation] =
    useState<AppointmentLocation | null>(null); // Use imported type
  const [appointmentDetails, setAppointmentDetails] = useState<string>("");
  const [recurrence, setRecurrence] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [locationInputValue, setLocationInputValue] = useState<string>("");

  // Effect to update local state when initialData or modal visibility changes
  useEffect(() => {
    if (isOpen) {
      const initialDate = initialData?.date || selectedDate || new Date(); // Priority: initial, context, today
      setCurrentSelectedDate(initialDate);
      // Ensure the context date is updated if initialData brings a different date
      // Only update context if the date part *differs* to avoid loops
      if (selectedDate?.toDateString() !== initialDate.toDateString()) {
        setSelectedDate(initialDate);
      }

      setSelectedClient(initialData?.client || null);
      setAppointmentStartTime(formatTime(initialData?.startTime));
      setAppointmentEndTime(formatTime(initialData?.endTime));
      setAppointmentLocation(initialData?.location || null);
      setLocationInputValue(initialData?.location?.formatted_address || "");
      setAppointmentDetails(initialData?.details || "");
      setRecurrence(initialData?.recurrence || []);
    } else {
      // Optional: Reset fields when closing if desired, though opening handles init
      // setCurrentSelectedDate(selectedDate); // Reset to context date on close?
    }
  }, [isOpen, initialData, selectedDate, setSelectedDate]); // Add selectedDate/setSelectedDate dependencies

  // Google Places Autocomplete Effect
  useEffect(() => {
    if (
      !isOpen ||
      typeof window === "undefined" ||
      !window.google?.maps?.places ||
      !inputRef.current
    )
      return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["establishment", "geocode"], // Allow addresses too
        componentRestrictions: { country: "br" },
        fields: ["place_id", "name", "formatted_address", "geometry"], // Specify needed fields
      }
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address && place.place_id) {
        setAppointmentLocation({
          name: place.name || place.formatted_address, // Use formatted_address if name is missing
          formatted_address: place.formatted_address,
          place_id: place.place_id,
        });
        setLocationInputValue(place.formatted_address); // Update input value on selection
      } else {
        // Handle case where place is not valid or user clears input manually
        // Check if the input still has value, maybe user typed an address manually
        if (inputRef.current?.value) {
          setAppointmentLocation({
            // Store raw input as a fallback
            name: inputRef.current.value,
            formatted_address: inputRef.current.value,
            place_id: "", // No place_id for manual input
          });
        } else {
          setAppointmentLocation(null); // Clear location if input is empty
        }
      }
    });

    // Cleanup listener on component unmount or when modal closes
    return () => {
      if (window.google && window.google.maps && listener) {
        window.google.maps.event.removeListener(listener);
        // Clean uppac-container divs added by Google Autocomplete
        const pacContainers = document.querySelectorAll(".pac-container");
        pacContainers.forEach((container) => container.remove());
      }
    };
  }, [isOpen, inputRef]); // Rerun effect when modal opens/closes

  // Handle manual changes to location input
  const handleLocationInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setLocationInputValue(newValue);
    // If user clears input, clear the selected location state
    if (!newValue) {
      setAppointmentLocation(null);
    } else if (
      !appointmentLocation ||
      newValue !== appointmentLocation.formatted_address
    ) {
      // If the input value differs from the selected place's address,
      // assume it's manual input and update location state accordingly (without place_id).
      setAppointmentLocation({
        name: newValue,
        formatted_address: newValue,
        place_id: "",
      });
    }
  };

  // Submit handler: calls the onSchedule prop with local state
  const handleInternalSchedule = () => {
    onSchedule({
      client: selectedClient,
      date: currentSelectedDate, // Use local state date
      startTime: appointmentStartTime,
      endTime: appointmentEndTime,
      location: appointmentLocation,
      details: appointmentDetails,
      recurrence: recurrence,
    });
  };

  const isEditing = !!initialData; // Check if we are editing

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="xl"
      title={null} // Keep null, custom title below
      closeOnClickOutside={false}
    >
      <Flex align="center" gap="md" mb="md">
        <Title order={4} style={{ margin: 0, whiteSpace: "nowrap" }}>
          {isEditing
            ? t("attendances.scheduleModal.editTitle")
            : t("attendances.scheduleModal.addTitle")}
        </Title>
        <Select
          placeholder={t("attendances.scheduleModal.selectClientPlaceholder")}
          data={clientData}
          value={selectedClient}
          onChange={setSelectedClient}
          style={{ minWidth: 220 }}
          searchable
          required
          nothingFoundMessage={t("common.noClientFound")}
          size="sm"
          disabled={isEditing}
        />
      </Flex>
      <Flex
        gap="lg"
        direction={{ base: "column", sm: "row" }}
        align="flex-start"
      >
        {" "}
        {/* Responsive direction */}
        <Group flex={1} justify="center" style={{ minWidth: "280px" }}>
          {" "}
          {/* Ensure calendar has enough width */}
          {/* <Text>Selecione o dia do atendimento</Text> */}
          <DatePicker
            value={currentSelectedDate} // Use local state for picker value
            onChange={setCurrentSelectedDate} // Update local state date
            minDate={new Date()} // Keep minDate for new appointments
            renderDay={renderDay}
            // disabled={isEditing} // Maybe disable date change when editing?
          />
        </Group>
        <Group flex={1} style={{ width: "100%" }}>
          {" "}
          {/* Make this group take remaining space */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 10,
              padding: "15px", // Adjusted padding
              minHeight: 120,
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
              border: "1px solid #f1f3f5",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: "340px", // Fixed height for consistency
            }}
          >
            <Text
              fw={600}
              mb={8}
              size="sm"
              style={{ flex: "none", letterSpacing: 0.2 }}
            >
              {t("attendances.scheduleModal.busySlotsLabel")}
            </Text>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {/* TODO: Implement logic to display busy intervals */}
              <Text size="sm" c="dimmed" style={{ fontSize: 14, padding: 8 }}>
                {t("attendances.scheduleModal.noBusySlots")}
              </Text>
            </div>
          </div>
        </Group>
      </Flex>
      {currentSelectedDate && (
        <>
          <Group mt="md" grow>
            {" "}
            {/* Use grow for equal width */}
            <div>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {t("attendances.scheduleModal.startTimeLabel")}
              </label>
              <input
                type="time"
                value={appointmentStartTime}
                onChange={(e) => setAppointmentStartTime(e.target.value)}
                disabled={!currentSelectedDate}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ced4da",
                  fontSize: 15,
                  lineHeight: 1.5, // Ensure consistent height
                }}
                required
                placeholder="HH:mm"
              />
            </div>
            <div>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {t("attendances.scheduleModal.endTimeLabel")}
              </label>
              <input
                type="time"
                value={appointmentEndTime}
                onChange={(e) => setAppointmentEndTime(e.target.value)}
                disabled={!currentSelectedDate}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ced4da",
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
                required
                placeholder="HH:mm"
              />
            </div>
          </Group>
          <Group my="md" grow>
            <MultiSelect
              label={t("attendances.scheduleModal.recurrenceLabel")}
              placeholder={t("attendances.scheduleModal.recurrencePlaceholder")}
              data={[
                { value: "0", label: t("common.weekdays.sunday") },
                { value: "1", label: t("common.weekdays.monday") },
                { value: "2", label: t("common.weekdays.tuesday") },
                { value: "3", label: t("common.weekdays.wednesday") },
                { value: "4", label: t("common.weekdays.thursday") },
                { value: "5", label: t("common.weekdays.friday") },
                { value: "6", label: t("common.weekdays.saturday") },
              ]}
              value={recurrence}
              onChange={setRecurrence}
              clearable
            />
          </Group>
          <Group>
            <div style={{ width: "100%" }}>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {t("attendances.scheduleModal.locationLabel")}
              </label>
              <input
                ref={inputRef}
                placeholder={t("attendances.scheduleModal.locationPlaceholder")}
                value={locationInputValue}
                onChange={handleLocationInputChange}
                required
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ced4da",
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
              />
              {/* Display selected address slightly differently for clarity */}
              {appointmentLocation?.formatted_address &&
                locationInputValue ===
                  appointmentLocation.formatted_address && (
                  <Text size="xs" c="dimmed" mt={4}>
                    {t("attendances.scheduleModal.locationSelected", {
                      address: appointmentLocation.formatted_address,
                    })}
                  </Text>
                )}
            </div>
          </Group>
          <Group mt="md">
            <div style={{ width: "100%" }}>
              <label
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                {t("attendances.scheduleModal.observationLabel")}
              </label>
              <textarea
                value={appointmentDetails}
                onChange={(e) => setAppointmentDetails(e.target.value)}
                placeholder={t(
                  "attendances.scheduleModal.observationPlaceholder"
                )}
                style={{
                  width: "100%",
                  minHeight: 60,
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ced4da",
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
              />
            </div>
          </Group>
          <Button
            mt="xl" // Increased margin top
            onClick={handleInternalSchedule}
            disabled={
              !selectedClient ||
              !appointmentStartTime ||
              !appointmentEndTime ||
              !appointmentLocation ||
              !appointmentLocation.formatted_address
            }
            fullWidth // Make button full width
          >
            {isEditing
              ? t("common.saveChanges")
              : t("attendances.scheduleModal.scheduleButton")}
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ScheduleAppointmentModal;
