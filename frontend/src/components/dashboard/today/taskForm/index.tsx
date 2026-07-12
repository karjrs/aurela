"use client";

import { Field, FieldLabel } from "@components/common/forms/field";
import { Input } from "@components/common/inputs/input";
import { Button } from "@components/common/ui/button";
import { useDurationLabel } from "@hooks/dashboard/useDurationLabel";
import { hourToTime, timeToHour } from "@utils/dateTime";
import { cn } from "@utils/helpers/cn";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { DURATION_OPTIONS, EMOJI_PRESETS } from "../consts";
import { EmojiPicker } from "./emojiPicker";
import type { TaskFormProps } from "./types";

export const TaskForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const t = useTranslations("dashboard.today.form");
  const tActions = useTranslations("actions");
  const durationLabel = useDurationLabel();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [time, setTime] = useState(hourToTime(initialValues?.hour ?? 9));
  const [duration, setDuration] = useState(initialValues?.duration ?? 1);
  const [emoji, setEmoji] = useState(initialValues?.emoji ?? EMOJI_PRESETS[0]);

  const isEditing = Boolean(initialValues);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), hour: timeToHour(time), duration, emoji });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <Field>
        <FieldLabel htmlFor="task-title">{t("titleLabel")}</FieldLabel>
        <Input
          id="task-title"
          autoFocus
          placeholder={t("titlePlaceholder")}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Field>

      <EmojiPicker value={emoji} onChange={setEmoji} />

      <div className="flex gap-3">
        <Field className="flex-1">
          <FieldLabel htmlFor="task-time">{t("timeLabel")}</FieldLabel>
          <Input
            id="task-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </Field>
        <Field className="flex-1">
          <FieldLabel htmlFor="task-duration">{t("durationLabel")}</FieldLabel>
          <select
            id="task-duration"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className={cn(
              "h-auto w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            )}
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {durationLabel(option)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {isEditing ? tActions("save") : t("addButton")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        >
          {tActions("cancel")}
        </Button>
      </div>
    </form>
  );
};
