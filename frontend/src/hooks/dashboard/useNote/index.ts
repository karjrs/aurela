"use client";

import { useState } from "react";
import type { NoteState } from "./types";

export const useNote = (): NoteState => {
  const [note, setNote] = useState("");

  return { note, setNote };
};
