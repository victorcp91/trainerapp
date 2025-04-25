import React, { useEffect } from "react";
import {
  Modal,
  Button,
  Grid,
  TextInput,
  Select,
  MultiSelect,
  Textarea,
  Group,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Client, ClientFormValues } from "@/types/client";

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
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingClient,
  genderOptions,
  clientTypeOptions,
  t,
  tCommon,
}) => {
  const form = useForm<ClientFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: null,
      gender: null,
      type: null,
      tags: [],
      observations: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 2
          ? t("newClientModal.validation.nameTooShort")
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value)
          ? null
          : t("newClientModal.validation.invalidEmail"),
      phone: (value) =>
        value && value.length < 10
          ? t("newClientModal.validation.invalidPhone")
          : null, // Assuming phone is optional based on UI
      birthDate: (value) =>
        value ? null : t("newClientModal.validation.birthDateRequired"),
      gender: (value) =>
        value ? null : t("newClientModal.validation.genderRequired"),
      type: (value) =>
        value ? null : t("newClientModal.validation.typeRequired"),
    },
  });

  useEffect(() => {
    if (editingClient) {
      form.setValues({
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone,
        birthDate: editingClient.startDate
          ? new Date(editingClient.startDate)
          : null, // Assuming startDate is birthDate
        gender: editingClient.gender,
        type: editingClient.type,
        tags: editingClient.tags,
        observations: "", // Assuming observations are not stored or fetched for editing
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingClient, isOpen]); // Reset form when modal opens or editingClient changes

  const handleFormSubmit = (values: ClientFormValues) => {
    onSubmit(values);
    // No need to close modal here, parent should handle based on onSubmit success
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        editingClient
          ? t("newClientModal.editTitle")
          : t("newClientModal.title")
      }
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label={t("newClientModal.nameLabel")}
              placeholder={t("newClientModal.namePlaceholder")}
              required
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label={t("newClientModal.emailLabel")}
              placeholder={t("newClientModal.emailPlaceholder")}
              type="email"
              required
              {...form.getInputProps("email")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label={t("newClientModal.phoneLabel")}
              placeholder={t("newClientModal.phonePlaceholder")}
              {...form.getInputProps("phone")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              valueFormat="YYYY-MM-DD" // Consistent format
              label={t("newClientModal.birthDateLabel")}
              placeholder={t("newClientModal.birthDateLabel")}
              required
              {...form.getInputProps("birthDate")}
              clearable // Allow clearing the date
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
            <MultiSelect
              label={t("newClientModal.tagsLabel")}
              placeholder={t("newClientModal.tagsPlaceholder")}
              data={form.values.tags} // Use form values for dynamic data if needed
              searchable
              {...form.getInputProps("tags")}
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

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{t("newClientModal.saveButton")}</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
