"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Stack,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { withAuth } from "@/utils/withAuth";

const LoginPage = () => {
  const t = useTranslations("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <Container
      size="lg"
      style={{ display: "flex", height: "100vh", alignItems: "center" }}
    >
      <Paper
        radius="md"
        p="xl"
        withBorder
        style={{
          flex: 1,
          maxWidth: 400,
          margin: "auto",
        }}
      >
        <Title order={2}>{t("title")}</Title>
        <Stack mt="lg">
          <Button fullWidth variant="outline">
            {t("loginWithGoogle")}
          </Button>
          <Text size="sm" color="dimmed">
            {t("orLoginWithEmail")}
          </Text>
          <TextInput
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Group mt="md">
            <Text size="sm" color="blue" component="a" href="/forgot-password">
              {t("forgotPassword")}
            </Text>
          </Group>
          <Button fullWidth mt="xl" onClick={handleLogin}>
            {t("login")}
          </Button>
          {error && <Text color="red">{error}</Text>}
          <Text size="sm" mt="md">
            {t("dontHaveAccount")}{" "}
            <Text component="a" href="/register" color="blue">
              {t("signUp")}
            </Text>
          </Text>
        </Stack>
      </Paper>
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/path/to/your/image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "none",
        }}
        className="desktop-only"
      />
      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-only {
            display: block;
          }
        }
      `}</style>
    </Container>
  );
};

export default withAuth(LoginPage, true);
