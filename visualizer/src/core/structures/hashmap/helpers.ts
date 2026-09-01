import type { HashMapState } from "./types";

export function toHashMapState(
  entries: Record<string | number, any>,
  options: Partial<HashMapState> = {},
): HashMapState {
  return {
    title: options.title || "Hash Map",
    entries: { ...entries },
    activeKey: options.activeKey,
    highlightKey: options.highlightKey,
    conflictKey: options.conflictKey,
  };
}

export function setHash<T extends Record<string | number, any>>(
  map: T,
  key: string | number,
  value: any,
): T {
  return {
    ...map,
    [key]: value,
  };
}

export function deleteHash<T extends Record<string | number, any>>(
  map: T,
  key: string | number,
): T {
  const next = { ...map };
  delete next[key];
  return next;
}
