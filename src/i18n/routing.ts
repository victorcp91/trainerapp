import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "pt",
  localePrefix: { mode: "as-needed" },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
