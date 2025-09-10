import type { TableMetaData, TableStore } from "@/type/table";

import { create } from "zustand";

// DuckD

// Fixed Zustand store
export const useTableStore = create<TableStore>((set) => ({
  // Initial state
  listTable: new Map(),
  selectedTable: null,
  currentShowingData: [],
  currentShowingHeaders: [],
  currentShowingDataMultiple: [],
  currentShowingHeadersMultiple: [],
  setCurrentShowingHeaders: (currentShowingHeaders: []) =>
    set({ currentShowingHeaders: currentShowingHeaders }),

  setCurrentShowingData: (currentShowingData: [][]) =>
    set({ currentShowingData: currentShowingData }),

  setCurrentShowingDataMultiple: (currentShowingDataMultiple: [][][]) =>
    set({ currentShowingDataMultiple: currentShowingDataMultiple }),

  setCurrentShowingHeadersMultiple: (currentShowingHeadersMultiple: [][]) =>
    set({ currentShowingHeadersMultiple: currentShowingHeadersMultiple }),

  setSelectedTable: (selectedTable: TableMetaData | null) =>
    set({ selectedTable: selectedTable }),

  setListTable: (listTable: Map<string, TableMetaData>) =>
    set({ listTable: listTable }),
}));

export default useTableStore;
