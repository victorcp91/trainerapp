"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const t = useTranslations("Register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to register with Google. Please try again.");
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
          <Button fullWidth variant="outline" onClick={handleGoogleSignUp}>
            {t("signUpWithGoogle")}
          </Button>
          <Text size="sm" color="dimmed">
            {t("orSignUpWithEmail")}
          </Text>
          <TextInput
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            required
          />
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
          <PasswordInput
            label={t("confirmPassword")}
            placeholder={t("confirmPasswordPlaceholder")}
            required
          />
          <Button fullWidth mt="xl" onClick={handleRegister}>
            {t("signUp")}
          </Button>
          {error && <Text color="red">{error}</Text>}
          <Text size="sm" mt="md">
            {t("alreadyHaveAccount")}{" "}
            <Text component="a" href="/login" color="blue">
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

export default withAuth(RegisterPage, true);
