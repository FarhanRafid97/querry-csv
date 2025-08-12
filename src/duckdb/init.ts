import { connection_db } from "./connection";

async function insertThenQuery() {
  const c = await connection_db;

  await c.query(
    `CREATE TABLE people(id INTEGER, name VARCHAR,age INTEGER,address VARCHAR);`
  );
  await c.query(`INSERT INTO people VALUES (1, 'Mark',20,'123 Main St');`);
  await c.query(`INSERT INTO people VALUES (2, 'Phil',21,'456 Main St');`);
  await c.query(`INSERT INTO people VALUES (3, 'Roger',22,'789 Main St');`);

  const query = await c.query(`SELECT * FROM people`),
    result = query.toArray().map((row) => row.toArray());

  return result;
}

export default {
  test: async function () {
    const result = await insertThenQuery();

    return result;
  },
};
