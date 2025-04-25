"use client";

import React, { useState } from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Modal,
  Text,
  FileButton,
  SimpleGrid,
  Avatar,
  ActionIcon,
  Select, // adicionado ActionIcon
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react"; // adicionado icone de edição
import { useTranslations } from "next-intl";

const AccountPage = () => {
  const t = useTranslations("AccountPage");

  // Estados da seção "Informações pessoais"
  const [nome, setNome] = useState(t("yourNamePlaceholder"));
  const [telefone, setTelefone] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Estados da seção "Segurança"
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estados da seção "Informações de plano"
  const [plano, setPlano] = useState("Gratuito");
  const [renovacao, setRenovacao] = useState("automática");
  // Adicionar datas de expiração e renovação
  const expirationDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();
  const renewalDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();
  const trialEndDate = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  // Estado do modal para exclusão de conta
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState("");

  const handleAtualizarSenha = () => {
    // Lógica de atualização de senha
    showNotification({
      title: t("notificationSuccessTitle"),
      message: t("notificationPasswordSuccessMessage"),
      color: "green",
    });
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  // Adicionar função para contratar plano
  const handleContratarPlano = () => {
    showNotification({
      title: t("notificationPlanHiredTitle"),
      message: t("notificationPlanHiredMessage"),
      color: "green",
    });
    setPlano("Premium");
  };

  const handleExcluirConta = () => {
    if (confirmacaoExclusao === t("deleteConfirmationText")) {
      // Lógica de exclusão de conta
      showNotification({
        title: t("notificationAccountDeletedTitle"),
        message: t("notificationAccountDeletedMessage"),
        color: "red",
      });
      setModalExclusaoAberto(false);
    }
  };

  const handleSalvarInfoPessoais = () => {
    // Lógica para salvar informações pessoais
    showNotification({
      title: t("notificationUpdatedTitle"),
      message: t("notificationUpdatedMessage"),
      color: "green",
    });
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        {t("title")}
      </Title>
      <SimpleGrid cols={2} spacing="lg">
        {/* Seção 1: Informações pessoais */}
        <Card
          shadow="sm"
          p="lg"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Agrupando avatar e input de nome na mesma linha */}
          <Group align="flex-end" mt="md">
            <FileButton onChange={setFile} accept="image/*">
              {(props) => (
                <div
                  style={{
                    position: "relative",
                    width: "fit-content",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                  {...props}
                >
                  <Avatar
                    src={file ? URL.createObjectURL(file) : undefined}
                    size={80}
                    radius="xl"
                  >
                    {!file &&
                      nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                  </Avatar>
                  <ActionIcon
                    variant="light"
                    style={{
                      position: "absolute",
                      right: "-5px",
                      bottom: "-5px",
                    }}
                  >
                    <IconPencil size={18} />
                  </ActionIcon>
                </div>
              )}
            </FileButton>
            <TextInput
              label={t("fullNameLabel")}
              value={nome}
              onChange={(e) => setNome(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>
          <Stack mt="md" style={{ flexGrow: 1 }}>
            <TextInput
              label={t("emailLabel")}
              value="seuemail@dominio.com"
              disabled
            />
            <TextInput
              label={t("phoneLabel")}
              placeholder={t("phonePlaceholder")}
              value={telefone}
              onChange={(e) => setTelefone(e.currentTarget.value)}
            />
          </Stack>
          <Button mt="xl" onClick={handleSalvarInfoPessoais}>
            {t("saveInfoButton")}
          </Button>
        </Card>

        {/* Seção 2: Segurança */}
        <Card
          shadow="sm"
          p="lg"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Title order={3}>{t("securityTitle")}</Title>
          <Stack mt="md" style={{ flexGrow: 1 }}>
            <PasswordInput
              label={t("currentPasswordLabel")}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.currentTarget.value)}
            />
            <PasswordInput
              label={t("newPasswordLabel")}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.currentTarget.value)}
            />
            <PasswordInput
              label={t("confirmNewPasswordLabel")}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.currentTarget.value)}
            />
          </Stack>
          <Button mt="xl" onClick={handleAtualizarSenha}>
            {t("updatePasswordButton")}
          </Button>
        </Card>

        {/* Seção 3: Informações de plano */}
        <Card
          shadow="sm"
          p="lg"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Title order={3}>{t("planInfoTitle")}</Title>
          <Stack style={{ flexGrow: 1 }}>
            <Text>
              {t("planTypeLabel", {
                plan: t(plano === "Gratuito" ? "planFree" : "planPremium"),
              })}
            </Text>
            {plano === "Premium" && (
              <>
                <Select
                  label={t("renewalLabel")}
                  data={[
                    { value: "automática", label: t("renewalAuto") },
                    { value: "manual", label: t("renewalManual") },
                  ]}
                  value={renovacao}
                  onChange={(value: string | null) =>
                    setRenovacao(value ?? "automática")
                  }
                />
                {renovacao === "manual" ? (
                  <Text color="dimmed" size="sm">
                    {t("expirationDateLabel", { date: expirationDate })}
                  </Text>
                ) : (
                  <Text color="dimmed" size="sm">
                    {t("renewalDateLabel", { date: renewalDate })}
                  </Text>
                )}
              </>
            )}
          </Stack>
          {plano === "Gratuito" && (
            <>
              <Text color="dimmed" size="sm">
                {t("trialEndDateLabel", { date: trialEndDate })}
              </Text>
              <Button mt="xl" onClick={handleContratarPlano}>
                {t("hirePlanButton")}
              </Button>
            </>
          )}
        </Card>

        {/* Seção 4: Ações críticas */}
        <Card
          shadow="sm"
          p="lg"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Title order={3}>{t("criticalActionsTitle")}</Title>
          <Button
            mt="xl"
            color="red"
            onClick={() => setModalExclusaoAberto(true)}
          >
            {t("deleteAccountButton")}
          </Button>
        </Card>
      </SimpleGrid>

      {/* Modal de confirmação para deleção */}
      <Modal
        opened={modalExclusaoAberto}
        onClose={() => setModalExclusaoAberto(false)}
        title={t("modalConfirmTitle")}
        centered
      >
        <Text mb="sm">{t("modalConfirmPrompt")}</Text>
        <TextInput
          placeholder={t("modalConfirmInputPlaceholder")}
          value={confirmacaoExclusao}
          onChange={(e) => setConfirmacaoExclusao(e.currentTarget.value)}
        />
        <Group mt="md">
          <Button
            mt="xl"
            variant="outline"
            onClick={() => setModalExclusaoAberto(false)}
          >
            {t("modalCancelButton")}
          </Button>
          <Button mt="xl" color="red" onClick={handleExcluirConta}>
            {t("modalConfirmButton")}
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default AccountPage;
