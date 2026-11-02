"use client";

import { useMode } from "@/components/mode/ModeProvider";
import { CustomerDisplay } from "@/components/receipt/CustomerDisplay";
import { vfdLine } from "@/components/receipt/vfd";
import { KeyButton, PrinterShell, SoftKeys } from "@/components/receipt/PrinterShell";
import { EntryView, headerLines } from "@/components/receipt/ReceiptParts";
import { modeOrder } from "@/content/projects";
import { site, whatsappHref } from "@/content/site";
import type { Lang } from "@/content/types";
import { dict, homeHref } from "@/lib/i18n";
import { absUrl } from "@/lib/links";
import { track } from "@/lib/track";
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { DEMO, fixedChips, profileBlocks, projectBlocks, projectSuggestions, run, type Ctx } from "./commands";
import { makeEntry } from "./format";
import { parse } from "./parser";
import { exportReceiptPng } from "./png";
import { initSim, isPrinting, simReducer, type SimState } from "./reducer";
import type { Block, CommandResult, Effect, Entry } from "./types";

const LINE_MS = 60;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const strip = (e: Entry): Omit<Entry, "id"> => ({ lines: e.lines, stamp: e.stamp, revealed: e.revealed });

export type SimulatorProps = {
  lang: Lang;
  /** Jalankan demo otomatis (hanya bila dimuat saat idle, bukan karena interaksi). */
  demo: boolean;
  focus?: boolean;
  pending?: string;
};

export function Simulator({ lang, demo, focus, pending }: SimulatorProps) {
  const d = dict(lang);
  const { mode, setMode } = useMode();

  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const runDemo = demo && !reduced && !pending;

  const [state, dispatch] = useReducer(simReducer, undefined, () => ({
    ...initSim(
      runDemo
        ? []
        : [
            strip(makeEntry(0, DEMO(lang)[0], profileBlocks(lang), -1)),
            strip(makeEntry(0, DEMO(lang)[1], projectBlocks(lang, mode), -1)),
          ],
    ),
    // Sama dengan saran setelah "proyek", supaya baris saran tidak kosong saat demo.
    suggestions: projectSuggestions(lang, mode),
  }));
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [demoOn, setDemoOn] = useState(runDemo);
  const [ready, setReady] = useState(false);

  const stateRef = useRef<SimState>(state);
  const modeRef = useRef(mode);
  const demoOnRef = useRef(runDemo);
  const demoPushed = useRef<string[]>([]);
  const cancelDemo = useRef<() => void>(() => {});
  const alive = useRef(true);
  const history = useRef<string[]>([]);
  const histIdx = useRef(0);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    stateRef.current = state;
    modeRef.current = mode;
  });

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const printing = isPrinting(state);

  // Mode berganti: saran keypad ikut ke proyek teratas mode baru.
  const modeSeen = useRef(mode);
  useEffect(() => {
    if (modeSeen.current === mode) return;
    modeSeen.current = mode;
    dispatch({ type: "suggest", suggestions: projectSuggestions(lang, mode) });
  }, [lang, mode]);

  // Mesin cetak: satu baris per 60ms, terasa mekanis.
  useEffect(() => {
    if (!printing) return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), LINE_MS);
    return () => window.clearInterval(id);
  }, [printing]);

  // "SIAP" sebentar setelah selesai mencetak.
  const wasPrinting = useRef(false);
  useEffect(() => {
    if (wasPrinting.current && !printing) {
      setReady(true);
      const id = window.setTimeout(() => setReady(false), 1200);
      wasPrinting.current = false;
      return () => window.clearTimeout(id);
    }
    if (printing) wasPrinting.current = true;
  }, [printing]);

  // Kertas maju: log selalu menempel ke baris terbaru.
  useLayoutEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.entries]);

  const waitIdle = useCallback(async () => {
    while (alive.current && isPrinting(stateRef.current)) await sleep(LINE_MS);
  }, []);

  const tear = useCallback(() => {
    const fresh = strip(makeEntry(0, null, [{ kind: "text", text: d.sim.fresh, tone: "muted" }], -1));
    if (reduced) {
      dispatch({ type: "newRoll", entries: [fresh] });
      dispatch({ type: "fed" });
      return;
    }
    dispatch({ type: "tear" });
    window.setTimeout(() => {
      if (!alive.current) return;
      dispatch({ type: "newRoll", entries: [fresh] });
      window.setTimeout(() => alive.current && dispatch({ type: "fed" }), 560);
    }, 380);
  }, [d.sim.fresh, reduced]);

  const applyEffect = useCallback(
    async (fx: Effect) => {
      switch (fx.type) {
        case "setMode":
          setMode(fx.mode);
          return;
        case "opened":
          track("Proyek dibuka", { slug: fx.slug, lewat: "simulator" });
          dispatch({ type: "opened", slug: fx.slug });
          return;
        case "voidLast":
          dispatch({ type: "stampLast", stamp: { text: d.sim.void.stamp, variant: "void" } });
          return;
        case "scrollTo":
          await waitIdle();
          await sleep(500);
          document.getElementById(fx.id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
          return;
        case "download": {
          await waitIdle();
          const a = document.createElement("a");
          a.href = fx.href;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
          return;
        }
        case "navigate":
          await waitIdle();
          await sleep(250);
          window.location.assign(fx.href);
          return;
        case "print": {
          await waitIdle();
          const paper = logRef.current;
          const fontFamily = paper ? getComputedStyle(paper).fontFamily : "monospace";
          await exportReceiptPng({
            header: headerLines(lang),
            entries: stateRef.current.entries,
            fontFamily,
            barcode: site.barcode,
            filename: `struk-${site.barcode.toLowerCase()}.png`,
            qr: { value: absUrl(homeHref(lang)), caption: d.sim.pngScan },
          });
          await sleep(300);
          tear();
          return;
        }
        case "clear":
          await waitIdle();
          await sleep(200);
          tear();
          return;
      }
    },
    [d.sim.void.stamp, lang, reduced, setMode, tear, waitIdle],
  );

  /** Menjalankan perintah dan mencetak jawabannya sekarang juga. */
  const pushCommand = useCallback(
    (text: string): CommandResult | null => {
      const s = stateRef.current;
      const ctx: Ctx = { lang, mode: modeRef.current, opened: s.opened, historyCount: s.entries.length };
      const res = run(text, ctx);
      if (!res) return null;
      const entry = makeEntry(0, text.trim(), res.blocks as Block[], reduced ? -1 : 0);
      dispatch({ type: "push", entry: strip(entry), suggestions: res.suggestions });
      for (const fx of res.effects) void applyEffect(fx);
      return res;
    },
    [applyEffect, lang, reduced],
  );

  const stopDemo = useCallback(() => {
    if (!demoOnRef.current) return;
    demoOnRef.current = false;
    cancelDemo.current();
    setDemoOn(false);
    setInput("");
    setCaret(0);
    dispatch({ type: "revealAll" });
    // Lengkapi struk demo seketika supaya isinya sama dengan versi statis.
    for (const cmd of DEMO(lang)) {
      if (demoPushed.current.includes(cmd)) continue;
      const blocks = cmd === DEMO(lang)[0] ? profileBlocks(lang) : projectBlocks(lang, modeRef.current);
      dispatch({ type: "push", entry: strip(makeEntry(0, cmd, blocks, -1)) });
      demoPushed.current.push(cmd);
    }
  }, [lang]);

  /** Input pengunjung: jeda 120ms setelah Enter, lalu mencetak. */
  const execute = useCallback(
    (raw: string) => {
      const text = raw.trim();
      stopDemo();
      if (!text) return;
      // Hanya nama perintah yang dicatat, bukan teks ketikan pengunjung.
      const parsed = parse(text);
      track("Perintah simulator", { perintah: parsed?.ok ? parsed.id : "tidak dikenal" });
      history.current.push(text);
      histIdx.current = history.current.length;
      window.setTimeout(() => alive.current && pushCommand(text), reduced ? 0 : 120);
    },
    [pushCommand, reduced, stopDemo],
  );

  // Demo otomatis sekali: "profil" lalu "proyek". Berhenti saat disentuh.
  useEffect(() => {
    if (!runDemo) return;
    let cancelled = false;
    cancelDemo.current = () => {
      cancelled = true;
    };
    (async () => {
      await sleep(450);
      for (const cmd of DEMO(lang)) {
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled) return;
          setInput(cmd.slice(0, i));
          setCaret(i);
          await sleep(70);
        }
        await sleep(160);
        if (cancelled) return;
        setInput("");
        setCaret(0);
        await sleep(120);
        if (cancelled) return;
        demoPushed.current.push(cmd);
        pushCommand(cmd);
        await sleep(LINE_MS * 2);
        await waitIdle();
        await sleep(380);
      }
      if (cancelled) return;
      demoOnRef.current = false;
      setDemoOn(false);
    })();
    return () => {
      cancelled = true;
    };
    // Demo hanya sekali saat mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interaksi sebelum simulator selesai dimuat: fokus input atau jalankan chip.
  // Dijaga ref supaya perintah tidak tercetak dua kali bila efek dijalankan ulang (StrictMode).
  const pendingRan = useRef(false);
  useEffect(() => {
    if (pending && !pendingRan.current) {
      pendingRan.current = true;
      execute(pending);
    }
    if (focus) inputRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Level A 3D: struk mengikuti arah pointer ±2°, hanya desktop.
  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      frame = 0;
      const tilt = tiltRef.current;
      const shadow = shadowRef.current;
      if (!tilt) return;
      const r = tilt.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + Math.min(r.height, window.innerHeight) / 2;
      const nx = Math.max(-1, Math.min(1, (px - cx) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (py - cy) / (window.innerHeight / 2)));
      tilt.style.setProperty("--rx", `${(nx * 2).toFixed(2)}deg`);
      tilt.style.setProperty("--ry", `${(-ny * 2).toFixed(2)}deg`);
      shadow?.style.setProperty("--sx", `${(-nx * 8).toFixed(1)}px`);
      shadow?.style.setProperty("--sy", `${(-ny * 5).toFixed(1)}px`);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const onAction = useCallback(
    (action: "wa") => {
      if (action === "wa") {
        track("Klik kontak", { kanal: "whatsapp" });
        const href = whatsappHref(d.contact.waText);
        if (href) window.open(href, "_blank", "noopener,noreferrer");
      }
    },
    [d.contact.waText],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const h = history.current;
      if (!h.length) return;
      e.preventDefault();
      histIdx.current = Math.max(0, Math.min(h.length, histIdx.current + (e.key === "ArrowUp" ? -1 : 1)));
      const v = h[histIdx.current] ?? "";
      setInput(v);
      setCaret(v.length);
    }
  };

  const syncCaret = (el: HTMLInputElement) => setCaret(el.selectionStart ?? el.value.length);

  // Layar pelanggan.
  const opened = state.opened.filter((s) => modeOrder[mode].includes(s)).length;
  const line1 = vfdLine(d.sim.vfdMode, d.sim.vfdModes[mode]);
  const line2 = printing
    ? vfdLine(d.sim.vfdPrinting)
    : ready
      ? vfdLine(d.sim.vfdReady)
      : vfdLine(d.sim.vfdOpened, `${opened} / ${modeOrder[mode].length}`);

  const feedClass = state.paper === "tearing" ? "paper-tear" : state.paper === "feeding" ? "paper-feed" : "";

  const chips = useMemo(() => fixedChips(lang), [lang]);

  // Saran yang sama dengan tombol keypad disaring. Bila hasilnya kosong,
  // saran sebelumnya tetap tampil supaya baris tidak berkedip kosong.
  const lastSoft = useRef<string[]>([]);
  const fresh = state.suggestions.filter((sg) => !chips.some((c) => c.cmd === sg)).slice(0, 3);
  const softKeys = fresh.length || !state.entries.length ? fresh : lastSoft.current;
  useEffect(() => {
    if (fresh.length) lastSoft.current = fresh;
  });

  return (
    <PrinterShell
      lang={lang}
      busy={printing}
      aside={
        demoOn ? (
          <button
            type="button"
            onClick={stopDemo}
            className="min-h-7 cursor-pointer text-kertas underline decoration-dotted underline-offset-4 hover:decoration-solid"
          >
            {d.sim.skipDemo}
          </button>
        ) : null
      }
      display={<CustomerDisplay label={d.sim.label} line1={line1} line2={line2} />}
      feedClass={feedClass}
      paperKey={state.roll}
      tiltRef={tiltRef}
      shadowRef={shadowRef}
      logRef={logRef}
      entries={state.entries.map((e) => (
        <EntryView key={e.id} entry={e} onRun={execute} onAction={onAction} />
      ))}
      input={
        <form
          className="mt-1 flex border-t border-dashed border-tinta/30 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            execute(input);
            setInput("");
            setCaret(0);
          }}
          onPointerDown={stopDemo}
        >
          <span aria-hidden className="ln ln-strong">
            {"> "}
          </span>
          <label htmlFor="sim-input" className="sr-only">
            {d.sim.inputLabel}
          </label>
          <span className="relative block min-w-0 flex-1">
            <input
              id="sim-input"
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                syncCaret(e.target);
              }}
              onSelect={(e) => syncCaret(e.currentTarget)}
              onKeyDown={onKeyDown}
              onFocus={() => {
                setFocused(true);
                stopDemo();
              }}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              maxLength={28}
              className="w-full min-w-0 bg-transparent font-mono text-[1em] leading-[1.35] text-tinta caret-transparent outline-none"
            />
            <span
              aria-hidden
              className={`caret pointer-events-none absolute top-[0.12em] ${focused || demoOn ? "" : "opacity-60"}`}
              style={{ left: `${Math.min(caret, 28)}ch` }}
            />
          </span>
        </form>
      }
      keys={chips.map((c) => (
        <KeyButton key={c.cmd} cmd={c.cmd} onRun={execute}>
          {c.label}
        </KeyButton>
      ))}
      softKeys={<SoftKeys cmds={softKeys} onRun={execute} />}
    />
  );
}

export default Simulator;
