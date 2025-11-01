import { create } from 'zustand';

interface RowHeightStore {
  rowHeight: 'short' | 'medium' | 'tall' | 'extra-tall';
  setRowHeight: (rowHeight: 'short' | 'medium' | 'tall' | 'extra-tall') => void;
}

export const useRowHeightStore = create<RowHeightStore>((set) => ({
  rowHeight: 'short',
  setRowHeight: (rowHeight: 'short' | 'medium' | 'tall' | 'extra-tall') => set({ rowHeight })
}));
