import { useState, useEffect, useRef, useCallback } from "react";
import { loadScratchpad, saveScratchpad, clearScratchpad } from "../../lib/scratchpad";

// ============================================================
// QUESTION SCRATCHPAD — Caderno de Resolução
// ============================================================

interface QuestionScratchpadProps {
  questionId: string;
  /** Categoria usada para escolher os botões rápidos sugeridos */
  categoryId?: string;
}

// ── Botões rápidos por tipo ────────────────────────────────

type QuickButton = { label: string; insert: string };

const MATH_BUTTONS: QuickButton[] = [
  { label: "+", insert: " + " },
  { label: "−", insert: " − " },
  { label: "×", insert: " × " },
  { label: "÷", insert: " ÷ " },
  { label: "=", insert: " = " },
  { label: "%", insert: "%" },
  { label: "√", insert: "√" },
  { label: "()", insert: "()" },
  { label: "→", insert: " → " },
  { label: "∴", insert: " ∴ " },
];

const TEXT_BUTTONS: QuickButton[] = [
  { label: "Sujeito", insert: "Sujeito: " },
  { label: "Verbo", insert: "Verbo: " },
  { label: "Objeto", insert: "Objeto: " },
  { label: "Tese", insert: "Tese: " },
  { label: "Conclusão", insert: "Conclusão: " },
];

const LOGIC_BUTTONS: QuickButton[] = [
  { label: "→", insert: " → " },
  { label: "∴", insert: " ∴ " },
  { label: "¬", insert: "¬" },
  { label: "∧", insert: " ∧ " },
  { label: "∨", insert: " ∨ " },
  { label: "∀", insert: "∀ " },
  { label: "∃", insert: "∃ " },
];

function getQuickButtons(categoryId?: string): { math: boolean; text: boolean; logic: boolean } {
  if (!categoryId) return { math: false, text: false, logic: false };
  const id = categoryId.toLowerCase();
  const isMath = id.includes("matematica") || id.includes("ciencias");
  const isLogic = id.includes("matematica") && id.includes("contest");
  const isText =
    id.includes("portugues") ||
    id.includes("legislacao") ||
    id.includes("especificos") ||
    id.includes("historia") ||
    id.includes("atualidades");
  return { math: isMath || isLogic, text: isText, logic: isLogic };
}

// ── Componente ─────────────────────────────────────────────

const MAX_CHARS = 800;

export function QuestionScratchpad({ questionId, categoryId }: QuestionScratchpadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carrega rascunho ao abrir ou trocar de questão
  useEffect(() => {
    const saved = loadScratchpad(questionId);
    setText(saved);
    setSavedAt(saved ? new Date() : null);
  }, [questionId]);

  // Auto-save com debounce de 600ms
  const scheduleSave = useCallback(
    (value: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveScratchpad(questionId, value);
        setSavedAt(new Date());
      }, 600);
    },
    [questionId]
  );

  // Cleanup do timer ao desmontar
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value.slice(0, MAX_CHARS);
    setText(value);
    scheduleSave(value);
  }

  function handleClear() {
    setText("");
    clearScratchpad(questionId);
    setSavedAt(null);
    textareaRef.current?.focus();
  }

  // Insere texto na posição do cursor
  function insertAtCursor(snippet: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = text.slice(0, start);
    const after = text.slice(end);
    const newText = (before + snippet + after).slice(0, MAX_CHARS);
    setText(newText);
    scheduleSave(newText);
    // Restaura cursor depois do texto inserido
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const hasContent = text.trim().length > 0;
  const quickCfg = getQuickButtons(categoryId);
  const showMath = quickCfg.math;
  const showLogic = quickCfg.logic;
  const showText = quickCfg.text;
  const showAnyQuick = showMath || showLogic || showText;

  // ── Botão flutuante (fechado) ─────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150 text-sm font-semibold
          ${hasContent
            ? "bg-indigo-900/40 border-indigo-600/60 text-indigo-300 hover:bg-indigo-900/60"
            : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
          }`}
        aria-label="Abrir caderno de resolução"
      >
        <span className="flex items-center gap-2">
          <span>📝</span>
          <span>Caderno de Resolução</span>
        </span>
        {hasContent ? (
          <span className="text-xs bg-indigo-800/60 text-indigo-300 border border-indigo-700 rounded-full px-2 py-0.5">
            {text.length} car.
          </span>
        ) : (
          <span className="text-slate-600 text-xs">Abrir ▾</span>
        )}
      </button>
    );
  }

  // ── Painel expandido ──────────────────────────────────────
  return (
    <div className="rounded-xl border border-indigo-700/50 bg-slate-900/80 overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/60 bg-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <span className="text-sm font-bold text-white">Caderno de Resolução</span>
        </div>
        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              salvo
            </span>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-300 text-sm px-1 transition-colors"
            aria-label="Fechar caderno"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Botões rápidos */}
      {showAnyQuick && (
        <div className="px-3 pt-2.5 pb-1 border-b border-slate-700/40 flex flex-col gap-1.5">
          {(showMath || showLogic) && (
            <div className="flex flex-wrap gap-1">
              {(showLogic ? [...MATH_BUTTONS, ...LOGIC_BUTTONS] : MATH_BUTTONS).map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => insertAtCursor(btn.insert)}
                  className="px-2 py-1 text-xs font-mono rounded-lg bg-slate-700/70 hover:bg-indigo-800/70 border border-slate-600/50 hover:border-indigo-600 text-slate-300 hover:text-white transition-all"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
          {showText && (
            <div className="flex flex-wrap gap-1">
              {TEXT_BUTTONS.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => insertAtCursor(btn.insert)}
                  className="px-2 py-1 text-xs rounded-lg bg-slate-700/70 hover:bg-violet-800/70 border border-slate-600/50 hover:border-violet-600 text-slate-300 hover:text-white transition-all"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Textarea */}
      <div className="p-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder={"Escreva seus cálculos, raciocínio ou anotações aqui...\nEx: 25% de 200 → 0,25 × 200 = 50"}
          className="w-full h-32 resize-none rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 text-sm leading-relaxed p-3 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 font-mono transition-colors"
          maxLength={MAX_CHARS}
          autoFocus
          spellCheck={false}
        />

        {/* Rodapé */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-slate-600">
            {text.length}/{MAX_CHARS}
          </span>
          <button
            onClick={handleClear}
            disabled={!hasContent}
            className="text-xs text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            🗑 Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
