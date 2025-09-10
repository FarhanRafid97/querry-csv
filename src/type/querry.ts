export interface QuerryState {
  executedQuerry: string;
  historyQuerry: string[];
  currentQuerry: string;
  errorQuerry: string;
}

export interface QuerryActions {
  setExecutedQuerry: (executedQuerry: string) => void;
  setCurrentQuerry: (currentQuerry: string) => void;
  setHistoryQuerry: (historyQuerry: string[]) => void;
  setErrorQuerry: (errorQuerry: string) => void;
}

export type QuerryStore = QuerryState & QuerryActions;
