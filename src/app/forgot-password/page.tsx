"use client";

import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { withAuth } from "@/utils/withAuth";

const ForgotPasswordPage = () => {
  const t = useTranslations("ForgotPassword");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to send password reset email. Please try again.");
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
          <Text size="sm" c="dimmed">
            {t("instruction")}
          </Text>
          <TextInput
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button fullWidth mt="xl" onClick={handlePasswordReset}>
            {t("sendResetLink")}
          </Button>
          {message && <Text c="green">{message}</Text>}
          {error && <Text c="red">{error}</Text>}
          <Text size="sm" mt="md">
            {t("rememberPassword")}{" "}
            <Text component="a" href="/login" c="blue">
              {t("logIn")}
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

export default withAuth(ForgotPasswordPage, true);
