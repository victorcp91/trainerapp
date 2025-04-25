"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Flex, Text, Grid, Container } from "@mantine/core";
import "dayjs/locale/pt-br";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useTranslations, useFormatter } from "next-intl";
import ClientCard from "@/components/clients/ClientCard";
import { Client, ClientFormValues } from "@/types/client";
import { ScheduleSubmitData } from "@/types/attendances";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientFormModal from "@/components/clients/ClientFormModal";
import ScheduleSessionModal from "@/components/clients/ScheduleSessionModal";
import ConfirmCancelModal from "@/components/clients/ConfirmCancelModal";

interface Attendance {
  clientId: string;
  date: string;
  times: [string, string];
  location?: string;
}

interface Interval {
  start: string;
  end: string;
  clientName: string;
  location?: string;
}

const clients: Client[] = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 28,
    gender: "female",
    email: "alice@example.com",
    phone: "555-123-4567",
    tags: ["Emagrecimento", "Definição Muscular"],
    status: "active",
    type: "online",
    profilePicture: "",
    avatar: "",
    planStatus: "on_track",
    startDate: "2024-05-10",
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 35,
    gender: "male",
    email: "bob@example.com",
    phone: "555-987-6543",
    tags: ["Hipertrofia", "Força"],
    status: "active",
    type: "in_person",
    profilePicture: "",
    avatar: "",
    planStatus: "near_due",
    startDate: "2023-01-15",
  },
  {
    id: "3",
    name: "Carol Wilson",
    age: 42,
    gender: "female",
    email: "carol@example.com",
    phone: "555-456-7890",
    tags: ["Flexibilidade", "Core"],
    status: "inactive",
    type: "hybrid",
    profilePicture: "",
    avatar: "",
    planStatus: "overdue",
    startDate: "2024-03-01",
  },
];

const ClientsPage = () => {
  const t = useTranslations("ClientsPage");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  const [showClientType, setShowClientType] = useState<string | null>("");
  const [showPlanStatus, setShowPlanStatus] = useState<string | null>("");
  const [showClientStatus, setShowClientStatus] = useState<string | null>(
    "active"
  );
  const [showGender, setShowGender] = useState<string | null>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [sortOption, setSortOption] = useState<string | null>("name_asc");
  const [loadedClients, setLoadedClients] = useState(clients.slice(0, 9));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(clients.length > 9);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<null | {
    idx: number;
    interval: Interval;
  }>(null);

  const attendances: Attendance[] = useMemo(
    () => [
      {
        clientId: "2",
        date: "2025-04-15",
        times: ["09:00", "10:00"],
        location: "Academia X",
      },
      {
        clientId: "2",
        date: "2025-04-16",
        times: ["14:00", "15:00"],
        location: "Estúdio Y",
      },
      {
        clientId: "1",
        date: "2025-04-15",
        times: ["11:00", "12:00"],
        location: "Online",
      },
    ],
    []
  );

  const occupiedDates = useMemo(() => {
    return attendances.map((a) => {
      const [year, month, day] = a.date.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [attendances]);

  const genderOptions = [
    { value: "male", label: t("genders.male") },
    { value: "female", label: t("genders.female") },
    { value: "other", label: t("genders.other") },
  ];

  const clientTypeOptions = [
    { value: "online", label: t("clientTypes.online") },
    { value: "in_person", label: t("clientTypes.in_person") },
    { value: "hybrid", label: t("clientTypes.hybrid") },
  ];

  const planStatusOptions = [
    { value: "on_track", label: t("planStatuses.on_track") },
    { value: "near_due", label: t("planStatuses.near_due") },
    { value: "overdue", label: t("planStatuses.overdue") },
  ];

  const weekDaysOptions = [
    { value: "0", label: t("weekDays.sunday") },
    { value: "1", label: t("weekDays.monday") },
    { value: "2", label: t("weekDays.tuesday") },
    { value: "3", label: t("weekDays.wednesday") },
    { value: "4", label: t("weekDays.thursday") },
    { value: "5", label: t("weekDays.friday") },
    { value: "6", label: t("weekDays.saturday") },
  ];

  const timeSlots = useMemo(() => {
    const generateTimeSlots = (
      startHour: number,
      endHour: number,
      intervalMinutes: number
    ) => {
      const slots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
          const time = `${String(hour).padStart(2, "0")}:${String(
            minute
          ).padStart(2, "0")}`;
          slots.push({ value: time, label: time });
        }
      }
      slots.push({
        value: `${String(endHour).padStart(2, "0")}:00`,
        label: `${String(endHour).padStart(2, "0")}:00`,
      });
      return slots;
    };
    return generateTimeSlots(6, 22, 30);
  }, []);

  const filteredAndSortedClients = useMemo(() => {
    const result = clients.filter((client) => {
      const nameMatch = client.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const typeMatch = !showClientType || client.type === showClientType;
      const planStatusMatch =
        !showPlanStatus || client.planStatus === showPlanStatus;
      const clientStatusMatch =
        !showClientStatus || client.status === showClientStatus;
      const genderMatch = !showGender || client.gender === showGender;

      return (
        nameMatch &&
        typeMatch &&
        planStatusMatch &&
        clientStatusMatch &&
        genderMatch
      );
    });

    if (sortOption === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name_desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "startDate_asc") {
      result.sort(
        (a, b) =>
          new Date(a.startDate || 0).getTime() -
          new Date(b.startDate || 0).getTime()
      );
    } else if (sortOption === "startDate_desc") {
      result.sort(
        (a, b) =>
          new Date(b.startDate || 0).getTime() -
          new Date(a.startDate || 0).getTime()
      );
    }

    return result;
  }, [
    searchQuery,
    showClientType,
    showPlanStatus,
    showClientStatus,
    showGender,
    sortOption,
  ]);

  useEffect(() => {
    setLoadedClients(filteredAndSortedClients.slice(0, 9));
    setHasMore(filteredAndSortedClients.length > 9);
  }, [filteredAndSortedClients]);

  const loadMoreClients = useCallback(() => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      setTimeout(() => {
        const currentLength = loadedClients.length;
        const nextClients = filteredAndSortedClients.slice(
          currentLength,
          currentLength + 9
        );
        setLoadedClients((prev) => [...prev, ...nextClients]);
        setHasMore(filteredAndSortedClients.length > currentLength + 9);
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, hasMore, loadedClients, filteredAndSortedClients]);

  const handleOpenModal = (clientToEdit: Client | null = null) => {
    setEditingClient(clientToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleOpenScheduleModal = (client: Client) => {
    setSelectedClient(client);
    setIsScheduleModalOpen(true);
    setConfirmCancel(null);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedClient(null);
  };

  const handleSubmit = (values: ClientFormValues) => {
    console.log("Submitting client:", values);
    setTimeout(() => {
      if (editingClient) {
        console.log("Updating client", editingClient.id, values);
      } else {
        console.log("Adding new client", values);
      }
      showNotification({
        title: t("newClientModal.successNotificationTitle"),
        message: editingClient
          ? t("newClientModal.successNotificationEditMessage")
          : t("newClientModal.successNotificationAddMessage"),
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      handleCloseModal();
    }, 500);
  };

  const handleScheduleSubmit = (data: ScheduleSubmitData) => {
    console.log("Scheduling data:", data);
    setTimeout(() => {
      showNotification({
        title: t("scheduleModal.successNotificationTitle"),
        message: t("scheduleModal.successNotificationMessage", {
          clientName: selectedClient?.name || "Client",
        }),
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      handleCloseScheduleModal();
    }, 1000);
  };

  const handleCancelAttendance = (idx: number) => {
    if (!confirmCancel) return;

    console.log("Cancelling attendance at index:", idx, confirmCancel.interval);
    setTimeout(() => {
      showNotification({
        title: t("scheduleModal.cancelSuccessNotificationTitle"),
        message: t("scheduleModal.cancelSuccessNotificationMessage", {
          clientName: confirmCancel.interval.clientName,
        }),
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      setConfirmCancel(null);
    }, 500);
  };

  return (
    <Container size="xl" py="xl">
      <Flex justify="space-between" align="center" mb="xl">
        <Text component="h2" size="xl" fw={700}>
          {t("title")}
        </Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => handleOpenModal()}
        >
          {t("newClientButton")}
        </Button>
      </Flex>

      <ClientFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showClientType={showClientType}
        setShowClientType={setShowClientType}
        showPlanStatus={showPlanStatus}
        setShowPlanStatus={setShowPlanStatus}
        showClientStatus={showClientStatus}
        setShowClientStatus={setShowClientStatus}
        showGender={showGender}
        setShowGender={setShowGender}
        sortOption={sortOption}
        setSortOption={setSortOption}
        clientTypeOptions={clientTypeOptions}
        planStatusOptions={planStatusOptions}
        genderOptions={genderOptions}
        t={t}
      />

      <Grid>
        {loadedClients.length > 0 ? (
          loadedClients.map((client) => {
            return (
              <Grid.Col key={client.id} span={{ base: 12, sm: 6, md: 4 }}>
                <ClientCard
                  client={client}
                  onEdit={handleOpenModal}
                  onSchedule={handleOpenScheduleModal}
                  t={t}
                />
              </Grid.Col>
            );
          })
        ) : (
          <Grid.Col span={12}>
            <Text c="dimmed" ta="center" py="xl">
              {t("noClientsFound")}
            </Text>
          </Grid.Col>
        )}
      </Grid>

      {hasMore && (
        <Flex justify="center" mt="xl">
          <Button
            onClick={loadMoreClients}
            loading={isLoading}
            variant="outline"
          >
            {t("loadMoreButton")}
          </Button>
        </Flex>
      )}

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingClient={editingClient}
        genderOptions={genderOptions}
        clientTypeOptions={clientTypeOptions}
        t={t}
        tCommon={tCommon}
      />

      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onSubmit={handleScheduleSubmit}
        client={selectedClient}
        attendances={attendances}
        timeSlots={timeSlots}
        weekDaysOptions={weekDaysOptions}
        occupiedDates={occupiedDates}
        onInitiateCancel={setConfirmCancel}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t={t as any}
        tCommon={tCommon}
        format={format}
      />

      <ConfirmCancelModal
        isOpen={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => {
          if (confirmCancel) {
            handleCancelAttendance(confirmCancel.idx);
          }
        }}
        intervalDetails={confirmCancel?.interval || null}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t={t as any}
      />
    </Container>
  );
};

export default ClientsPage;
