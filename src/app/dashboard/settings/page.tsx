"use client";

import React from "react";
import { Card, Stack, Title, Divider, Select, Container } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

function SettingsPage() {
  const t = useTranslations("SettingsPage");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string | null) => {
    console.log(newLocale);
    if (newLocale && typeof pathname === "string") {
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
      router.refresh();
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="md">
        {t("title")}
      </Title>
      <Divider my="md" />
      <Card shadow="sm" p="lg">
        <Stack>
          <Select
            label={t("selectLanguageLabel")}
            placeholder={t("selectLanguagePlaceholder")}
            data={[
              { value: "pt", label: t("languages.pt") },
              { value: "en", label: t("languages.en") },
            ]}
            value={locale}
            onChange={handleLanguageChange}
          />
        </Stack>
      </Card>
    </Container>
  );
}

export default SettingsPage;
