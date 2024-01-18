import pg from "pg";
import "dotenv/config";

const Pool = pg.Pool;
let { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, NODE_ENV } = process.env;

const pool = new Pool(
	NODE_ENV === "dev"
		? {
				user: PGUSER,
				password: PGPASSWORD,
				host: PGHOST,
				port: PGPORT,
				database: PGDATABASE,
				ssl: {},
		  }
		: {
				host: PGHOST,
				database: PGDATABASE,
				username: PGUSER,
				password: PGPASSWORD,
				port: PGPORT,
				ssl: {},
				// connection: {
				// 	options: `project=${ENDPOINT_ID}`,
				// },
		  }
);

export default pool;
