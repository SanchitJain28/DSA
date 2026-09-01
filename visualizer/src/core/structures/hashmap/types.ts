export interface HashMapState {
  title?: string;
  entries: Record<string | number, any>;
  activeKey?: string | number;
  highlightKey?: string | number;
  conflictKey?: string | number;
}
