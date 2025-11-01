import usePanelResizeStore, { type PanelResize } from '@/store/panel-resize';
import React from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceResizHeight(height: number, key: PanelResize, delay: number): void {
  const { setPanelResize, panelResize } = usePanelResizeStore();

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const selectedPanel = panelResize[key as PanelResize];
      if (selectedPanel) {
        setPanelResize(key, selectedPanel.width, height);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, height, key, panelResize, setPanelResize]);

  return;
}
