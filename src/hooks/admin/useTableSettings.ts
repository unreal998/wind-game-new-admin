import { type SortingState, type VisibilityState } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface TableSettings {
  columnVisibility: VisibilityState;
  columnOrder: string[];
  sorting: SortingState;
}

export function useTableSettings(defaultSettings?: TableSettings) {
  const pathname = usePathname();
  const storageKey = `table-settings-${pathname.replace(/^\//, "")}`;

  const [settings, setSettings] = useState<TableSettings>(() => {
    if (typeof window === "undefined") {
      return defaultSettings ||
        { columnVisibility: {}, columnOrder: [], sorting: [] };
    }

    const savedSettings = localStorage.getItem(storageKey);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return defaultSettings ||
      { columnVisibility: {}, columnOrder: [], sorting: [] };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings, storageKey]);

  return {
    settings,
    updateSettings: (newSettings: Partial<TableSettings>) => {
      setSettings((prev) => ({
        ...prev,
        ...newSettings,
      }));
    },
    resetSettings: () => {
      localStorage.removeItem(storageKey);
      setSettings(
        defaultSettings ||
          { columnVisibility: {}, columnOrder: [], sorting: [] },
      );
    },
  };
}
