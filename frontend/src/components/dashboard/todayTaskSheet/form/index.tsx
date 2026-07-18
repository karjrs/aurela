"use client";

import { Field, FieldLabel } from "@components/common/forms/field";
import { Input } from "@components/common/inputs/input";
import { Button } from "@components/common/ui/button";
import { cn } from "@utils/helpers/cn";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import {
  DEFAULT_VALUES,
  DURATION_OPTIONS,
  EMOJI_PRESETS,
  hourToTimeString,
  timeStringToHour,
} from "../consts";
import { EmojiPicker } from "../emojiPicker";
import type { TaskFormValues } from "../types";
import type { TaskSheetFormProps } from "./types";

const formatDuration = (
  t: (key: string, values?: Record<string, number>) => string,
  duration: number,
) => {
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);

  if (hours === 0) return t("minutes", { minutes });
  if (minutes === 0) return t("hours", { hours });
  return t("hoursMinutes", { hours, minutes });
};

export const TaskSheetForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: TaskSheetFormProps) => {
  const t = useTranslations("dashboard.today.taskSheet");
  const tDuration = useTranslations("dashboard.today.taskSheet.duration");
  const tActions = useTranslations("actions");
  const [values, setValues] = useState<TaskFormValues>(
    initialValues ?? DEFAULT_VALUES,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.title.trim()) return;
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <EmojiPicker
        aria-label={t("emojiLabel")}
        value={values.emoji}
        onChange={(emoji) => setValues((prev) => ({ ...prev, emoji }))}
        options={EMOJI_PRESETS}
      />

      <Field>
        <FieldLabel htmlFor="task-title">{t("titleLabel")}</FieldLabel>
        <Input
          id="task-title"
          autoFocus
          placeholder={t("titlePlaceholder")}
          value={values.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
        />
      </Field>

      <div className="flex gap-3">
        <Field className="flex-1">
          <FieldLabel htmlFor="task-time">{t("timeLabel")}</FieldLabel>
          <Input
            id="task-time"
            type="time"
            value={hourToTimeString(values.hour)}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                hour: timeStringToHour(event.target.value),
              }))
            }
          />
        </Field>

        <Field className="flex-1">
          <FieldLabel htmlFor="task-duration">{t("durationLabel")}</FieldLabel>
          <select
            id="task-duration"
            value={values.duration}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                duration: Number(event.target.value),
              }))
            }
            className={cn(
              "h-auto w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            )}
          >
            {DURATION_OPTIONS.map((duration) => (
              <option key={duration} value={duration}>
                {formatDuration(tDuration, duration)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <Button type="submit">{t("addButton")}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {tActions("cancel")}
        </Button>
      </div>
    </form>
  );
};
