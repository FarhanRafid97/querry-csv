import type { AsyncDuckDBInstance, DuckDBModule, DuckDBStore } from '@/type/duckdb-state-type';
import * as duckdb from '@duckdb/duckdb-wasm';
import { useEffect } from 'react';
import { create } from 'zustand';

// DuckDB initialization function
async function instantiateDuckDB(dbModule: DuckDBModule): Promise<AsyncDuckDBInstance> {
  try {
    const CDN_BUNDLES = dbModule.getJsDelivrBundles();
    const bundle = await dbModule.selectBundle(CDN_BUNDLES);
    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: 'text/javascript'
      })
    );

    const worker = new Worker(worker_url);
    const logger = new dbModule.ConsoleLogger();
    const db = new dbModule.AsyncDuckDB(logger, worker);

    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);
    await db.registerFileURL(
      'httpfs.duckdb_extension',
      'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm',
      duckdb.DuckDBDataProtocol.HTTP,
      true
    );

    // Enable autoinstall for known extensions
    const connection = await db.connect();
    await connection.query('SET autoinstall_known_extensions=1;');
    await connection.query('INSTALL httpfs;');
    await connection.query('LOAD httpfs;');

    // Disconnect temp connection (optional, could keep for main usage)
    await connection.close();

    return db;
  } catch (error) {
    console.log('error disisni', error);
    throw new Error('Failed to initialize DuckDB');
  }
}

// Fixed Zustand store
export const useDuckDBStore = create<DuckDBStore>((set, get) => ({
  // Initial state
  db: null,
  connection: null,
  listTable: new Map(),
  currentShowingData: [],
  loading: false,
  error: null,
  selectedTable: null,
  isInitialized: false,

  setError: (error: string) => set({ error: error }),

  setCurrentShowingData: (currentShowingData: object[]) => set({ currentShowingData: currentShowingData }),

  // Actions
  initialize: async () => {
    const { db, loading, isInitialized } = get();

    // Prevent multiple initializations
    if (isInitialized || db || loading) {
      console.log('DuckDB already initialized or initialization in progress');
      return;
    }

    set({ loading: true, error: null });

    try {
      const newDb = await instantiateDuckDB(duckdb);
      const connection = await newDb.connect();
      connection.query(`INSTALL httpfs`);
      connection.query(`LOAD 'httpfs';`);

      set({
        db: newDb,
        connection,
        loading: false,
        error: null,
        isInitialized: true,
        currentShowingData: []
      });

      console.log('DuckDB initialized successfully');
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize DuckDB',
        isInitialized: false
      });
      console.error('Failed to initialize DuckDB:', error);
    }
  },

  executeQuery: async (query: string) => {
    const { connection, db } = get();

    if (!connection || !db) {
      throw new Error('DuckDB not initialized. Call initialize() first.');
    }

    try {
      const result = await connection.query(`${query}`);
      const headers = result.schema.fields.map((field) => field.name);
      return [{ result, headers }, null];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Query execution failed';

      return [null, errorMessage];
    }
  },

  closeConnection: async () => {
    const { connection, db } = get();

    try {
      if (connection) {
        await connection.close();
      }
      if (db) {
        await db.terminate();
      }

      set({
        db: null,
        connection: null,
        error: null,
        isInitialized: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to close connection';
      set({ error: errorMessage });
      throw error;
    }
  }
}));

export default useDuckDBStore;

// Singleton pattern - ensures only one initialization across the entire app
let initializationPromise: Promise<void> | null = null;

export const initializeDuckDBOnce = async (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = useDuckDBStore.getState().initialize();
  return initializationPromise;
};

// Auto-initialize hook - useful for components that need DuckDB ready
export const useAutoInitializeDuckDB = () => {
  const { isInitialized, loading, error } = useDuckDBStore();

  useEffect(() => {
    if (!isInitialized && !loading) {
      initializeDuckDBOnce();
    }
  }, [isInitialized, loading]);

  return { isInitialized, loading, error };
};
