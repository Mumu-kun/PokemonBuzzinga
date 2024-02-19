import pg from "pg";
import "dotenv/config";

const Pool = pg.Pool;
let { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, NODE_ENV } = process.env;

const pool = new Pool({
	user: PGUSER,
	password: PGPASSWORD,
	host: PGHOST,
	port: PGPORT,
	database: PGDATABASE,
	ssl: {},
});

export default pool;
