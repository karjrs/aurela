"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/common/ui/sheet";
import { useTranslations } from "next-intl";
import { TaskSheetForm } from "./form";
import type { TaskFormSheetProps } from "./types";

export const TaskFormSheet = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: TaskFormSheetProps) => {
  const t = useTranslations("dashboard.today.taskSheet");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <TaskSheetForm
          initialValues={initialValues}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
};
