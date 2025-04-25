"use client";

import React, { useState } from "react";
import {
  Button,
  Group,
  Title,
  Modal,
  TextInput,
  Indicator,
  Container,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import {
  AttendanceProvider,
  useAttendance,
} from "@/contexts/AttendanceContext";

import SummaryCards from "@/components/attendances/SummaryCards";
import CalendarSidebar from "@/components/attendances/CalendarSidebar";
import DayDetails from "@/components/attendances/DayDetails";
import ScheduleAppointmentModal from "@/components/attendances/ScheduleAppointmentModal";

import {
  Appointment,
  ClientOption,
  ScheduleDetails,
} from "@/types/attendances";

const AttendanceContent = () => {
  const t = useTranslations();
  const {
    selectedDate,
    appointments,
    clientData,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    markAbsence,
    checkIn,
  } = useAttendance();

  // Keep mock stats locally in the page component for visual purposes
  // TODO: Remove these when API provides real aggregate stats
  const [totalAppointments] = useState(120);
  const [completedAppointments] = useState(60);
  const [canceledAppointments] = useState(25);
  const [missedAppointments] = useState(15);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [currentAction, setCurrentAction] = useState<{
    type: "cancel" | "absence";
    appointmentId: number | null;
  }>({ type: "cancel", appointmentId: null });

  const handleOpenScheduleModal = (appointmentToEdit: Appointment | null) => {
    setEditingAppointment(appointmentToEdit);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setEditingAppointment(null);
  };

  const handleScheduleAppointment = (details: ScheduleDetails) => {
    if (editingAppointment) {
      const updatedClientLabel = clientData.find(
        (c) => c.value === details.client
      )?.label;
      const updatedAppointment: Appointment = {
        ...editingAppointment,
        client: updatedClientLabel || editingAppointment.client,
        startTime:
          details.date && details.startTime
            ? new Date(
                `${details.date.toISOString().split("T")[0]}T${
                  details.startTime
                }:00`
              ).toISOString()
            : editingAppointment.startTime,
        endTime:
          details.date && details.endTime
            ? new Date(
                `${details.date.toISOString().split("T")[0]}T${
                  details.endTime
                }:00`
              ).toISOString()
            : editingAppointment.endTime,
        location: details.location,
        observation: details.details,
        address:
          details.location?.formatted_address || editingAppointment.address,
      };
      updateAppointment(updatedAppointment);
    } else {
      const newId = Math.max(0, ...appointments.map((a) => a.id)) + 1;
      const clientLabel = clientData.find(
        (c) => c.value === details.client
      )?.label;
      const newAppointment: Appointment = {
        id: newId,
        client: clientLabel || "Unknown Client",
        startTime:
          details.date && details.startTime
            ? new Date(
                `${details.date.toISOString().split("T")[0]}T${
                  details.startTime
                }:00`
              ).toISOString()
            : new Date().toISOString(),
        endTime:
          details.date && details.endTime
            ? new Date(
                `${details.date.toISOString().split("T")[0]}T${
                  details.endTime
                }:00`
              ).toISOString()
            : new Date().toISOString(),
        address: details.location?.formatted_address || "",
        avatar: "",
        location: details.location,
        observation: details.details,
      };
      addAppointment(newAppointment);
    }
    handleCloseScheduleModal();
  };

  const handleOpenReasonModal = (type: "cancel" | "absence", id: number) => {
    setCurrentAction({ type, appointmentId: id });
    setReason("");
    setIsReasonModalOpen(true);
  };

  const handleCloseReasonModal = () => {
    setIsReasonModalOpen(false);
  };

  const handleConfirmReason = () => {
    const { type, appointmentId } = currentAction;
    if (appointmentId === null) return;

    if (type === "cancel") {
      deleteAppointment(appointmentId);
      console.log(`Canceling appointment ${appointmentId}, Reason: ${reason}`);
    } else if (type === "absence") {
      markAbsence(appointmentId, reason);
    }
    handleCloseReasonModal();
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      selectedDate &&
      new Date(appointment.startTime).toDateString() ===
        selectedDate.toDateString()
  );

  const dailyStats = {
    total: filteredAppointments.length,
    completed: 0,
    canceled: 0,
    missed: 0,
  };

  const renderDay = (date: Date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const dayAppointments = appointments.filter(
      (appointment) =>
        new Date(appointment.startTime).toDateString() === date.toDateString()
    );
    const hasAppointments = dayAppointments.length > 0;

    return (
      <div
        style={{
          backgroundColor:
            isToday &&
            selectedDate &&
            date.toDateString() !== selectedDate?.toDateString()
              ? "#e0f7fa"
              : "transparent",
          borderRadius: "50%",
          padding: "5px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {date.getDate()}
        {hasAppointments && (
          <Indicator
            size={6}
            color="blue"
            offset={-5}
            style={{ position: "absolute", bottom: 4, right: 4 }}
          />
        )}
      </div>
    );
  };

  const createInitialDataForEdit = (
    appointment: Appointment | null
  ): ScheduleDetails | undefined => {
    if (!appointment) return undefined;
    const clientValue =
      clientData.find((c) => c.label === appointment.client)?.value || null;
    return {
      client: clientValue,
      date: new Date(appointment.startTime),
      startTime: new Date(appointment.startTime).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date(appointment.endTime).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: appointment.location || null,
      details: appointment.observation || "",
      recurrence: [],
    };
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        {t("attendances.pageTitle")}
      </Title>

      <SummaryCards
        totalAppointments={totalAppointments}
        completedAppointments={completedAppointments}
        canceledAppointments={canceledAppointments}
        missedAppointments={missedAppointments}
      />

      <Group align="flex-start" wrap="nowrap">
        <CalendarSidebar renderDay={renderDay} />

        <DayDetails
          appointments={filteredAppointments}
          totalAppointments={dailyStats.total}
          completedAppointments={dailyStats.completed}
          canceledAppointments={dailyStats.canceled}
          missedAppointments={dailyStats.missed}
          onCheckIn={checkIn}
          onOpenReasonModal={handleOpenReasonModal}
          onEditAppointment={(app) => handleOpenScheduleModal(app)}
          onOpenScheduleModal={() => handleOpenScheduleModal(null)}
        />
      </Group>

      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onSchedule={handleScheduleAppointment}
        renderDay={renderDay}
        initialData={createInitialDataForEdit(editingAppointment)}
      />

      <Modal
        opened={isReasonModalOpen}
        onClose={handleCloseReasonModal}
        title={
          currentAction.type === "cancel"
            ? t("attendances.cancelModal.title")
            : t("attendances.absenceModal.title")
        }
        centered
      >
        <TextInput
          label={t("attendances.cancelModal.reasonLabel")}
          placeholder={t("common.describeReasonPlaceholder")}
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
          data-autofocus
        />
        <Button mt="md" fullWidth onClick={handleConfirmReason}>
          {t("common.confirm")}
        </Button>
      </Modal>
    </Container>
  );
};

const AttendancePage = () => {
  const initialMockAppointments: Appointment[] = [
    {
      id: 1,
      client: "João Silva",
      address: "Rua das Flores, 123 - São Paulo, SP",
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 3600000).toISOString(),
      avatar: "",
      location: {
        name: "Smart Fit - Flores",
        formatted_address: "Rua das Flores, 123 - São Paulo, SP",
        place_id: "mock_place_id_1",
      },
      observation: "Treino de perna",
    },
    {
      id: 2,
      client: "Maria Oliveira",
      address: "Avenida Paulista, 456 - São Paulo, SP",
      startTime: new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString(),
      endTime: new Date(
        new Date(new Date().setDate(new Date().getDate() + 1)).getTime() +
          3600000
      ).toISOString(),
      avatar: "",
      location: {
        name: "Bodytech - Paulista",
        formatted_address: "Avenida Paulista, 456 - São Paulo, SP",
        place_id: "mock_place_id_2",
      },
    },
  ];
  const initialMockClientData: ClientOption[] = [
    { value: "1", label: "João Silva" },
    { value: "2", label: "Maria Oliveira" },
    { value: "3", label: "Alice Johnson" },
  ];

  return (
    <AttendanceProvider
      initialAppointments={initialMockAppointments}
      initialClientData={initialMockClientData}
    >
      <AttendanceContent />
    </AttendanceProvider>
  );
};

export default AttendancePage;
