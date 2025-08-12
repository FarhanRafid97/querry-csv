import * as duckdb from "@duckdb/duckdb-wasm";

type DuckDBModule = typeof duckdb;
type AsyncDuckDBInstance = InstanceType<typeof duckdb.AsyncDuckDB>;
type DuckDBConnection = Awaited<ReturnType<AsyncDuckDBInstance["connect"]>>;

async function instantiateDuckDB(
  dbModule: DuckDBModule
): Promise<AsyncDuckDBInstance> {
  const CDN_BUNDLES = dbModule.getJsDelivrBundles();
  const bundle = await dbModule.selectBundle(CDN_BUNDLES);
  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], {
      type: "text/javascript",
    })
  );

  const worker = new Worker(worker_url);
  const logger = new dbModule.ConsoleLogger("DEBUG");
  const db = new dbModule.AsyncDuckDB(logger, worker);

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  return db;
}

export const db: AsyncDuckDBInstance = await instantiateDuckDB(duckdb);
export const connection_db: DuckDBConnection = await db.connect();
