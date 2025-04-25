import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Grid,
  TextInput,
  Select,
  Textarea,
  Group,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Client, ClientFormValues } from "@/types/client";

// Placeholder User type - Add optional fields
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Optional
  birthDate?: string; // Optional (assuming string from API, convert later)
  gender?: string; // Optional
  // Add other relevant fields as needed
}

// Define Anamnesis Model structure (adjust if needed based on actual type)
interface AnamnesisModelOption {
  value: string; // Model ID
  label: string; // Model Name
}

interface Option {
  value: string;
  label: string;
}

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => void;
  editingClient: Client | null;
  genderOptions: Option[];
  clientTypeOptions: Option[];
  anamnesisModelOptions: AnamnesisModelOption[]; // Add prop for models
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

// TEMPORARY: Mock data for Anamnesis Models - Remove when passed via props
const MOCK_ANAMNESIS_MODELS: AnamnesisModelOption[] = [
  { value: "model1", label: "Modelo Padrão FitUno" },
  { value: "model2", label: "Avaliação Inicial Rápida" },
  { value: "model3", label: "Foco em Lesões" },
];

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingClient,
  genderOptions,
  clientTypeOptions,
  // anamnesisModelOptions, // Temporarily comment out prop
  t,
  tCommon,
}) => {
  // Use mock data for now
  const anamnesisModelOptions = MOCK_ANAMNESIS_MODELS;

  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFullForm, setShowFullForm] = useState(!!editingClient);
  const [userNotFound, setUserNotFound] = useState(false);

  const form = useForm<ClientFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: null,
      gender: null,
      type: null,
      observations: "",
      anamnesisModelId: null, // Initialize new field
    },
    validate: {
      name: (value: string) =>
        value.trim().length < 2
          ? t("newClientModal.validation.nameTooShort")
          : null,
      email: (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? null
          : t("newClientModal.validation.invalidEmail"),
      phone: (value: string | null | undefined) =>
        value && value.length < 10
          ? t("newClientModal.validation.invalidPhone")
          : null,
      birthDate: (value: Date | null) =>
        value ? null : t("newClientModal.validation.birthDateRequired"),
      gender: (value: string | null) =>
        value ? null : t("newClientModal.validation.genderRequired"),
      type: (value: string | null) =>
        value ? null : t("newClientModal.validation.typeRequired"),
      anamnesisModelId: (value: string | null) =>
        value ? null : t("newClientModal.validation.anamnesisModelRequired"),
    },
  });

  useEffect(() => {
    setSearchEmail("");
    setFoundUser(null);
    setIsSearching(false);
    setUserNotFound(false);

    if (editingClient) {
      setShowFullForm(true);
      form.setValues({
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone || "",
        birthDate: editingClient.startDate
          ? new Date(editingClient.startDate)
          : null,
        gender: editingClient.gender || null,
        type: editingClient.type || null,
        observations: "",
        anamnesisModelId: null, // Reset on edit for now (no existing data)
      });
    } else {
      setShowFullForm(false);
      form.reset(); // form.reset() will set anamnesisModelId to null based on initialValues
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingClient, isOpen]);

  const handleSearchUser = async () => {
    if (!searchEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchEmail)) {
      form.setFieldError("email", t("newClientModal.validation.invalidEmail"));
      return;
    }
    form.clearErrors();
    setIsSearching(true);
    setUserNotFound(false);
    setFoundUser(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add optional fields to mock data
      const mockUserData: User | null =
        searchEmail === "found@example.com"
          ? {
              id: "user123",
              name: "Usuário de Teste",
              email: searchEmail,
              phone: "11999998888", // Add mock phone
              birthDate: "1990-05-15", // Add mock birth date (as string)
              gender: "male", // Add mock gender
            }
          : null;

      if (mockUserData) {
        setFoundUser(mockUserData);
        // Pre-fill form with found user's data, including new optional fields
        form.setValues({
          ...form.values,
          name: mockUserData.name,
          email: mockUserData.email,
          phone: mockUserData.phone || "",
          birthDate: mockUserData.birthDate
            ? new Date(mockUserData.birthDate)
            : null,
          gender: mockUserData.gender || null,
          // type, tags, observations remain specific to the client record being created
        });
        setShowFullForm(true);
      } else {
        setFoundUser(null);
        setUserNotFound(true);
        form.setFieldValue("email", searchEmail);
        setShowFullForm(true);
      }
    } catch (error) {
      console.error("Failed to search user:", error);
      setUserNotFound(true);
      setShowFullForm(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFormSubmit = (values: ClientFormValues) => {
    onSubmit(values);
  };

  // New handler for the form's onSubmit event
  const handleFormSubmissionAttempt = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault(); // Prevent default browser submission

    // If we are in the initial search phase
    if (!editingClient && !showFullForm) {
      // Directly call the search handler
      handleSearchUser();
    } else {
      // Otherwise, trigger the form validation and submission for the full form
      form.onSubmit(handleFormSubmit)();
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={(() => {
        if (editingClient) {
          return t("newClientModal.editTitle");
        } else if (!showFullForm) {
          return t("newClientModal.searchTitle");
        } else {
          return t("newClientModal.title");
        }
      })()}
      size="lg"
    >
      <LoadingOverlay visible={isSearching} overlayProps={{ blur: 2 }} />
      <form onSubmit={handleFormSubmissionAttempt}>
        {!editingClient && !showFullForm && (
          <Grid align="flex-end">
            <Grid.Col span={10}>
              <TextInput
                label={t("newClientModal.searchEmailLabel")}
                placeholder={t("newClientModal.searchEmailPlaceholder")}
                type="email"
                value={searchEmail}
                onChange={(event) => setSearchEmail(event.currentTarget.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <ActionIcon
                variant="filled"
                aria-label={t("newClientModal.searchButtonLabel")}
                onClick={handleSearchUser}
                disabled={isSearching || !searchEmail}
                size="lg"
              >
                <IconSearch size={18} />
              </ActionIcon>
            </Grid.Col>
          </Grid>
        )}

        {showFullForm && (
          <Grid>
            {!editingClient && foundUser && (
              <Grid.Col span={12} style={{ color: "green" }}>
                {t("newClientModal.userFoundMessage", { name: foundUser.name })}
              </Grid.Col>
            )}
            {!editingClient && userNotFound && (
              <Grid.Col span={12} style={{ color: "orange" }}>
                {t("newClientModal.userNotFoundMessage")}
              </Grid.Col>
            )}

            <Grid.Col span={6}>
              <TextInput
                label={t("newClientModal.nameLabel")}
                placeholder={t("newClientModal.namePlaceholder")}
                required
                {...form.getInputProps("name")}
                disabled={!!foundUser}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label={t("newClientModal.emailLabel")}
                placeholder={t("newClientModal.emailPlaceholder")}
                type="email"
                required
                {...form.getInputProps("email")}
                disabled={!!foundUser}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label={t("newClientModal.phoneLabel")}
                placeholder={t("newClientModal.phonePlaceholder")}
                {...form.getInputProps("phone")}
                disabled={!!foundUser && !!foundUser.phone}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DateInput
                valueFormat="YYYY-MM-DD"
                label={t("newClientModal.birthDateLabel")}
                placeholder={t("newClientModal.birthDateLabel")}
                required
                {...form.getInputProps("birthDate")}
                clearable={!(!!foundUser && !!foundUser.birthDate)}
                disabled={!!foundUser && !!foundUser.birthDate}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label={t("newClientModal.genderLabel")}
                placeholder={t("newClientModal.genderPlaceholder")}
                data={genderOptions}
                required
                {...form.getInputProps("gender")}
                clearable
                disabled={!!foundUser && !!foundUser.gender}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label={t("newClientModal.typeLabel")}
                placeholder={t("newClientModal.typePlaceholder")}
                data={clientTypeOptions}
                required
                {...form.getInputProps("type")}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Select
                label={t("newClientModal.anamnesisModelLabel")}
                placeholder={t("newClientModal.anamnesisModelPlaceholder")}
                data={anamnesisModelOptions}
                {...form.getInputProps("anamnesisModelId")}
                required
                clearable
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label={t("newClientModal.observationsLabel")}
                placeholder={t("newClientModal.observationsPlaceholder")}
                rows={3}
                {...form.getInputProps("observations")}
              />
            </Grid.Col>
          </Grid>
        )}

        {showFullForm && (
          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isSearching}>
              {editingClient
                ? t("newClientModal.saveChangesButton")
                : t("newClientModal.createClientButton")}
            </Button>
          </Group>
        )}
      </form>
    </Modal>
  );
};

export default ClientFormModal;
