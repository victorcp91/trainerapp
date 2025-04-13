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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const t = useTranslations("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to log in with Google. Please try again.");
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
          <Button fullWidth variant="outline" onClick={handleGoogleLogin}>
            {t("loginWithGoogle")}
          </Button>
          <Text size="sm" c="dimmed">
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
            <Text size="sm" c="blue" component="a" href="/forgot-password">
              {t("forgotPassword")}
            </Text>
          </Group>
          <Button fullWidth mt="xl" onClick={handleLogin}>
            {t("login")}
          </Button>
          {error && <Text c="red">{error}</Text>}
          <Text size="sm" mt="md">
            {t("dontHaveAccount")}{" "}
            <Text component="a" href="/register" c="blue">
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

export default withAuth(LoginPage, false);
