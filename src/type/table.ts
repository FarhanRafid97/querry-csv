export interface TableMetaData {
  label: string;
  columns: string[];
  total_data: number;
}

export interface TableState {
  selectedTable: TableMetaData | null;
  listTable: Map<string, TableMetaData>;
  currentShowingData: [][];
  currentShowingDataMultiple: [][][];
  currentShowingHeaders: [][];
  currentShowingHeadersMultiple: [][];
}

export interface TableActions {
  setListTable: (listTable: Map<string, TableMetaData>) => void;
  setCurrentShowingData: (currentShowingData: [][]) => void;
  setCurrentShowingDataMultiple: (currentShowingData: [][][]) => void;
  setSelectedTable: (selectedTable: TableMetaData | null) => void;
  setCurrentShowingHeaders: (currentShowingHeaders: []) => void;
  setCurrentShowingHeadersMultiple: (currentShowingHeaders: [][]) => void;
}

export type TableStore = TableState & TableActions;
