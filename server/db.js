import pg from "pg";
import "dotenv/config";

const Pool = pg.Pool;

const pool = new Pool({
	user: process.env.USER,
	password: process.env.PASSWORD,
	host: process.env.DBHOST,
	port: process.env.DBPORT,
	database: process.env.DB,
});

export default pool;
