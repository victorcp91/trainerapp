"use client";

import React, { useState } from "react";
import { withAuth } from "@/utils/withAuth";
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

const AccountPage = () => {
  // Estados da seção "Informações pessoais"
  const [nome, setNome] = useState("Seu Nome");
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
      title: "Sucesso",
      message: "Senha atualizada com sucesso",
      color: "green",
    });
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  // Adicionar função para contratar plano
  const handleContratarPlano = () => {
    showNotification({
      title: "Plano Contratado",
      message: "Você contratou um novo plano.",
      color: "green",
    });
    setPlano("Premium");
  };

  const handleExcluirConta = () => {
    if (confirmacaoExclusao === "Quero excluir") {
      // Lógica de exclusão de conta
      showNotification({
        title: "Conta excluída",
        message: "Sua conta foi deletada",
        color: "red",
      });
      setModalExclusaoAberto(false);
    }
  };

  const handleSalvarInfoPessoais = () => {
    // Lógica para salvar informações pessoais
    showNotification({
      title: "Atualizado",
      message: "Informações pessoais atualizadas",
      color: "green",
    });
  };

  return (
    <Container size="lg" py="xl">
      <SimpleGrid cols={2} spacing="lg">
        {/* Seção 1: Informações pessoais */}
        <Card
          shadow="sm"
          p="lg"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Title order={3}>Informações Pessoais</Title>
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
              label="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
          </Group>
          <Stack mt="md" style={{ flexGrow: 1 }}>
            <TextInput label="E-mail" value="seuemail@dominio.com" disabled />
            <TextInput
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.currentTarget.value)}
            />
          </Stack>
          <Button mt="xl" onClick={handleSalvarInfoPessoais}>
            Salvar Informações
          </Button>
        </Card>

        {/* Seção 2: Segurança */}
        <Card
          shadow="sm"
          p="lg"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Title order={3}>Segurança</Title>
          <Stack mt="md" style={{ flexGrow: 1 }}>
            <PasswordInput
              label="Senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.currentTarget.value)}
            />
            <PasswordInput
              label="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.currentTarget.value)}
            />
            <PasswordInput
              label="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.currentTarget.value)}
            />
          </Stack>
          <Button mt="xl" onClick={handleAtualizarSenha}>
            Atualizar senha
          </Button>
        </Card>

        {/* Seção 3: Informações de plano */}
        <Card
          shadow="sm"
          p="lg"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Title order={3}>Informações de Plano</Title>
          <Stack style={{ flexGrow: 1 }}>
            <Text>Tipo de plano: {plano}</Text>
            {plano === "Premium" && (
              <>
                <Select
                  label="Renovação"
                  data={[
                    { value: "automática", label: "Automática" },
                    { value: "manual", label: "Manual" },
                  ]}
                  value={renovacao}
                  onChange={(value: string | null) =>
                    setRenovacao(value ?? "automática")
                  }
                />
                {renovacao === "manual" ? (
                  <Text color="dimmed" size="sm">
                    Data de expiração: {expirationDate}
                  </Text>
                ) : (
                  <Text color="dimmed" size="sm">
                    Data de renovação: {renewalDate}
                  </Text>
                )}
              </>
            )}
          </Stack>
          {plano === "Gratuito" && (
            <>
              <Text color="dimmed" size="sm">
                Data final do período de teste: {trialEndDate}
              </Text>
              <Button mt="xl" onClick={handleContratarPlano}>
                Contratar Plano
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
          <Title order={3}>Ações Críticas</Title>
          <Button
            mt="xl"
            color="red"
            onClick={() => setModalExclusaoAberto(true)}
          >
            Excluir minha conta
          </Button>
        </Card>
      </SimpleGrid>

      {/* Modal de confirmação para deleção */}
      <Modal
        opened={modalExclusaoAberto}
        onClose={() => setModalExclusaoAberto(false)}
        title="Confirmação"
        centered
      >
        <Text mb="sm">
          Digite “Quero excluir” para confirmar a exclusão da conta.
        </Text>
        <TextInput
          placeholder="Confirmação"
          value={confirmacaoExclusao}
          onChange={(e) => setConfirmacaoExclusao(e.currentTarget.value)}
        />
        <Group mt="md">
          <Button
            mt="xl"
            variant="outline"
            onClick={() => setModalExclusaoAberto(false)}
          >
            Cancelar
          </Button>
          <Button mt="xl" color="red" onClick={handleExcluirConta}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default withAuth(AccountPage, true);
