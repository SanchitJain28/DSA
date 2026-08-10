export type ThemeName = "cyan" | "orange" | "fuchsia" | "emerald" | "teal" | "indigo" | "rose" | "violet" | "amber" | "sky";

export const themeColors: Record<ThemeName, {
  edgeNull: string;
  edge: string;
  nodeNullBg: string;
  nodeNullBorder: string;
  nodeActiveBg: string;
  nodeActiveBorder: string;
  titleClass: string;
  callStackBg: string;
  callStackText: string;
  callStackBorder: string;
  phaseText: string;
  variablesText: string;
  explanationBg: string;
  explanationBorder: string;
}> = {
  cyan: {
    edgeNull: "#164e63",
    edge: "#0891b2",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#164e63",
    nodeActiveBorder: "#22d3ee",
    titleClass: "from-cyan-400 to-teal-500",
    callStackBg: "bg-cyan-950",
    callStackText: "text-cyan-200",
    callStackBorder: "border-cyan-800",
    phaseText: "text-cyan-400",
    variablesText: "text-cyan-400",
    explanationBg: "bg-cyan-950/30",
    explanationBorder: "border-cyan-900/50",
  },
  orange: {
    edgeNull: "#7c2d12",
    edge: "#ea580c",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#7c2d12",
    nodeActiveBorder: "#f97316",
    titleClass: "from-orange-400 to-amber-500",
    callStackBg: "bg-orange-950",
    callStackText: "text-orange-200",
    callStackBorder: "border-orange-800",
    phaseText: "text-orange-400",
    variablesText: "text-orange-400",
    explanationBg: "bg-orange-950/30",
    explanationBorder: "border-orange-900/50",
  },
  fuchsia: {
    edgeNull: "#4a044e",
    edge: "#86198f",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#701a75",
    nodeActiveBorder: "#e879f9",
    titleClass: "from-fuchsia-400 to-pink-500",
    callStackBg: "bg-fuchsia-950",
    callStackText: "text-fuchsia-200",
    callStackBorder: "border-fuchsia-800",
    phaseText: "text-fuchsia-400",
    variablesText: "text-fuchsia-400",
    explanationBg: "bg-fuchsia-950/30",
    explanationBorder: "border-fuchsia-900/50",
  },
  emerald: {
    edgeNull: "#064e3b",
    edge: "#059669",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#064e3b",
    nodeActiveBorder: "#34d399",
    titleClass: "from-emerald-400 to-green-500",
    callStackBg: "bg-emerald-950",
    callStackText: "text-emerald-200",
    callStackBorder: "border-emerald-800",
    phaseText: "text-emerald-400",
    variablesText: "text-emerald-400",
    explanationBg: "bg-emerald-950/30",
    explanationBorder: "border-emerald-900/50",
  },
  teal: {
    edgeNull: "#134e4a",
    edge: "#0d9488",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#134e4a",
    nodeActiveBorder: "#2dd4bf",
    titleClass: "from-teal-400 to-emerald-500",
    callStackBg: "bg-teal-950",
    callStackText: "text-teal-200",
    callStackBorder: "border-teal-800",
    phaseText: "text-teal-400",
    variablesText: "text-teal-400",
    explanationBg: "bg-teal-950/30",
    explanationBorder: "border-teal-900/50",
  },
  indigo: {
    edgeNull: "#312e81",
    edge: "#4f46e5",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#312e81",
    nodeActiveBorder: "#818cf8",
    titleClass: "from-indigo-400 to-purple-500",
    callStackBg: "bg-indigo-950",
    callStackText: "text-indigo-200",
    callStackBorder: "border-indigo-800",
    phaseText: "text-indigo-400",
    variablesText: "text-indigo-400",
    explanationBg: "bg-indigo-950/30",
    explanationBorder: "border-indigo-900/50",
  },
  rose: {
    edgeNull: "#4c0519",
    edge: "#e11d48",
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#881337",
    nodeActiveBorder: "#fb7185",
    titleClass: "from-rose-400 to-pink-500",
    callStackBg: "bg-rose-950",
    callStackText: "text-rose-200",
    callStackBorder: "border-rose-800",
    phaseText: "text-rose-400",
    variablesText: "text-rose-400",
    explanationBg: "bg-rose-950/30",
    explanationBorder: "border-rose-900/50",
  },
  violet: {
    edgeNull: "#4c1d95", // violet-900
    edge: "#7c3aed", // violet-600
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#5b21b6", // violet-800
    nodeActiveBorder: "#a78bfa", // violet-400
    titleClass: "from-violet-400 to-fuchsia-500",
    callStackBg: "bg-violet-950",
    callStackText: "text-violet-200",
    callStackBorder: "border-violet-800",
    phaseText: "text-violet-400",
    variablesText: "text-violet-400",
    explanationBg: "bg-violet-950/30",
    explanationBorder: "border-violet-900/50",
  },
  amber: {
    edgeNull: "#78350f", // amber-900
    edge: "#d97706", // amber-600
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#92400e", // amber-800
    nodeActiveBorder: "#fbbf24", // amber-400
    titleClass: "from-amber-400 to-orange-500",
    callStackBg: "bg-amber-950",
    callStackText: "text-amber-200",
    callStackBorder: "border-amber-800",
    phaseText: "text-amber-400",
    variablesText: "text-amber-400",
    explanationBg: "bg-amber-950/30",
    explanationBorder: "border-amber-900/50",
  },
  sky: {
    edgeNull: "#0c4a6e", // sky-900
    edge: "#0284c7", // sky-600
    nodeNullBg: "#9f1239",
    nodeNullBorder: "#f43f5e",
    nodeActiveBg: "#075985", // sky-800
    nodeActiveBorder: "#38bdf8", // sky-400
    titleClass: "from-sky-400 to-blue-500",
    callStackBg: "bg-sky-950",
    callStackText: "text-sky-200",
    callStackBorder: "border-sky-800",
    phaseText: "text-sky-400",
    variablesText: "text-sky-400",
    explanationBg: "bg-sky-950/30",
    explanationBorder: "border-sky-900/50",
  },
};
