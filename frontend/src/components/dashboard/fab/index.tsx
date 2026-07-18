"use client";

import { Button } from "@components/common/ui/button";
import type { ButtonProps } from "@components/common/ui/button/types";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export const DashboardFab = ({ onClick, ...rest }: ButtonProps) => {
  const t = useTranslations("dashboard");

  return (
    <Button
      type="button"
      onClick={onClick}
      aria-label={t("form.addTaskButton")}
      className="fixed right-4 bottom-20 z-30 size-14 rounded-full shadow-lg md:right-6 md:bottom-6"
      {...rest}
    >
      <Plus className="size-6" aria-hidden />
    </Button>
  );
};
