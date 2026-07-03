import { VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";
import { fieldVariants } from "./consts";

export type FieldProps = ComponentProps<"div"> &
  VariantProps<typeof fieldVariants>;

export type FieldLegendProps = ComponentProps<"legend"> & {
  variant?: "legend" | "label";
};

export type FieldSeparatorProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

export type FieldErrorProps = ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
};
