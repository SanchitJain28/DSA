import Queue from "../shared/Queue";
import type { ThemeName } from "../../utils/theme";

interface QueuePanelProps {
  state: string[] | { items: string[]; title?: string };
  theme?: ThemeName;
}

export default function QueuePanel({
  state,
  theme = "emerald",
}: QueuePanelProps) {
  const items = Array.isArray(state) ? state : state?.items || [];
  const title = Array.isArray(state) ? "BFS QUEUE" : state?.title || "BFS QUEUE";

  return <Queue queue={items} title={title} theme={theme} />;
}
