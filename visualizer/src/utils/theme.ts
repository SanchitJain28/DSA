export type ThemeName = "bone" | "cyan" | "orange" | "fuchsia" | "emerald" | "teal" | "indigo" | "rose" | "violet" | "amber" | "sky";

export interface ThemeConfig {
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
}

const DEFAULT_BONE_THEME: ThemeConfig = {
  edgeNull: "#2e2e34",
  edge: "#3d3d45",
  nodeNullBg: "#2b1c1c",
  nodeNullBorder: "#b08a8a",
  nodeActiveBg: "#302e2a",
  nodeActiveBorder: "#c9c3b6",
  titleClass: "text-[#ededf0]",
  callStackBg: "bg-[#141417]",
  callStackText: "text-[#ededf0]",
  callStackBorder: "border-[#3d3d45]",
  phaseText: "text-[#c9c3b6]",
  variablesText: "text-[#c9c3b6]",
  explanationBg: "bg-[#131316]",
  explanationBorder: "border-[#1e1e23]",
};

export const themeColors: Record<ThemeName, ThemeConfig> = {
  bone: { ...DEFAULT_BONE_THEME },
  cyan: { ...DEFAULT_BONE_THEME },
  orange: { ...DEFAULT_BONE_THEME },
  fuchsia: { ...DEFAULT_BONE_THEME },
  emerald: { ...DEFAULT_BONE_THEME },
  teal: { ...DEFAULT_BONE_THEME },
  indigo: { ...DEFAULT_BONE_THEME },
  rose: { ...DEFAULT_BONE_THEME },
  violet: { ...DEFAULT_BONE_THEME },
  amber: { ...DEFAULT_BONE_THEME },
  sky: { ...DEFAULT_BONE_THEME },
};
