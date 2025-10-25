import { create } from "zustand";

// DuckD
export type PanelResize = "resize-result" | "resize-query";

interface PanelResizeStore {
  panelResize: {
    [key in PanelResize]: {
      width: number;
      height: number;
      isResizing: boolean;
    };
  };
  setPanelResize: (key: PanelResize, width: number, height: number) => void;
  setPanelOnResize: (key: PanelResize, isResizing: boolean) => void;
}

// Fixed Zustand store
export const usePanelResizeStore = create<PanelResizeStore>((set) => ({
  // Initial state
  panelResize: {
    "resize-result": {
      width: 0,
      height: 50,
      isResizing: false,
    },
    "resize-query": {
      width: 0,
      height: 50,
      isResizing: false,
    },
  },
  setPanelResize: (key: PanelResize, width: number, height: number) => {
    set((state) => {
      return {
        panelResize: {
          ...state.panelResize,
          [key]: { width, height },
        },
      };
    });
  },
  setPanelOnResize: (key: PanelResize, isResizing: boolean) => {
    set((state) => {
      return {
        panelResize: {
          ...state.panelResize,
          [key]: { ...state.panelResize[key], isResizing },
        },
      };
    });
  },
}));

export default usePanelResizeStore;
