import type { Entry, StampVariant } from "./types";

const MAX_ENTRIES = 40;

export type SimState = {
  entries: Entry[];
  opened: string[];
  suggestions: string[];
  /** feeding = gulungan baru keluar, tearing = struk disobek. */
  paper: "steady" | "tearing" | "feeding";
  roll: number;
  nextId: number;
};

export type SimAction =
  | { type: "push"; entry: Omit<Entry, "id">; suggestions?: string[] }
  | { type: "tick" }
  | { type: "revealAll" }
  | { type: "stampLast"; stamp: { text: string; variant: StampVariant } }
  | { type: "opened"; slug: string }
  | { type: "suggest"; suggestions: string[] }
  | { type: "tear" }
  | { type: "newRoll"; entries: Omit<Entry, "id">[] }
  | { type: "fed" };

export function initSim(entries: Omit<Entry, "id">[]): SimState {
  return {
    entries: entries.map((e, i) => ({ ...e, id: i + 1 })),
    opened: [],
    suggestions: [],
    paper: "steady",
    roll: 0,
    nextId: entries.length + 1,
  };
}

export const isPrinting = (s: SimState) => s.entries.some((e) => e.revealed < e.lines.length);

export function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case "push": {
      const entries = [...state.entries, { ...action.entry, id: state.nextId }].slice(-MAX_ENTRIES);
      return {
        ...state,
        entries,
        nextId: state.nextId + 1,
        suggestions: action.suggestions ?? state.suggestions,
      };
    }
    case "tick": {
      const i = state.entries.findIndex((e) => e.revealed < e.lines.length);
      if (i < 0) return state;
      const entries = state.entries.slice();
      entries[i] = { ...entries[i], revealed: entries[i].revealed + 1 };
      return { ...state, entries };
    }
    case "revealAll":
      if (!isPrinting(state)) return state;
      return { ...state, entries: state.entries.map((e) => ({ ...e, revealed: e.lines.length })) };
    case "stampLast": {
      // Stempel jatuh ke jawaban sebelum perintah "void" itu sendiri.
      if (state.entries.length < 2) return state;
      const entries = state.entries.slice();
      const target = entries.length - 2;
      entries[target] = { ...entries[target], stamp: action.stamp };
      return { ...state, entries };
    }
    case "opened":
      if (state.opened.includes(action.slug)) return state;
      return { ...state, opened: [...state.opened, action.slug] };
    case "suggest":
      return { ...state, suggestions: action.suggestions };
    case "tear":
      return { ...state, paper: "tearing" };
    case "newRoll":
      return {
        ...state,
        paper: "feeding",
        roll: state.roll + 1,
        entries: action.entries.map((e, i) => ({ ...e, id: state.nextId + i })),
        nextId: state.nextId + action.entries.length,
        suggestions: [],
      };
    case "fed":
      return { ...state, paper: "steady" };
  }
}
