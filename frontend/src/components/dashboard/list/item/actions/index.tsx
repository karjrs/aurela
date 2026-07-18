"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardListItemActionsButton } from "./button";
import type { DashboardListItemActionsProps } from "./types";

export const DashboardListItemActions = ({
  onEdit,
  onRemove,
}: DashboardListItemActionsProps) => {
  const t = useTranslations("dashboard.task");

  return (
    <>
      <DashboardListItemActionsButton onClick={onEdit} ariaLabel={t("edit")}>
        <Pencil aria-hidden />
      </DashboardListItemActionsButton>
      <DashboardListItemActionsButton
        onClick={onRemove}
        ariaLabel={t("delete")}
      >
        <Trash2 aria-hidden />
      </DashboardListItemActionsButton>
    </>
  );
};
