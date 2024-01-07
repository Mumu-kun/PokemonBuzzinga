import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./db.js";

const PORT = process.env.PORT || 8080;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/pokemons", async (req, res) => {
	try {
		const { rows } = await pool.query(`
            SELECT *
                FROM POKEMONS;
        `);

		console.log(rows);

		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
	}
});

app.get("/pokemons/:id", async (req, res) => {
	try {
		const pokemond_id = req.params.id;
		const { rows } = await pool.query(
			`
            SELECT *
                FROM POKEMONS
                WHERE POKEMOND_ID = $1;
        `,
			[pokemond_id]
		);

		if (rows.length == 0) {
			const errMsg = `Pokemon with ID:${pokemond_id} does not exist.`;
			throw new Error(errMsg);
		}

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(errMsg);
	}
});

app.get("/login", async (req, res) => {
	try {
		const formData = req.body;

		const { rows } = await pool.query(
			`
            SELECT *
            FROM TRAINERS
            WHERE NAME = $1 AND PASSWORD = $2;
        `,
			[formData.name, formData.password]
		);

		if (rows.length == 0) {
			const errMsg = `Trainer does not exist.`;
			throw new Error(errMsg);
		}

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(errMsg);
	}
});

app.get("/owned-pokemons/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;

		const { rows } = await pool.query(
			`
            SELECT OP.ID, OP.NICKNAME, P.*, PIT.TEAM_ID
                FROM OWNED_POKEMONS OP
                JOIN POKEMONS P
                    ON OP.POKEMON_ID = P.POKEMON_ID
                LEFT JOIN POKEMON_IN_TEAM PIT
                    ON OP.ID =  PIT.OWNED_POKEMON_ID
                WHERE TRAINER_ID = $1;
        `,
			[trainerId]
		);

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(400);
	}
});

app.post("/owned-pokemons/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;
		const formData = req.body;

		const { rows } = await pool.query(
			`
            INSERT INTO 
            OWNED_POKEMONS(POKEMON_ID, TRAINER_ID, NICKNAME)
            VALUES($1, $2, $3) RETURNING *;
        `,
			[formData.pokemonId, trainerId, formData.nickname]
		);

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.detail);
	}
});

app.get("/teams/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;

		const { rows } = await pool.query(
			`
            SELECT *
                FROM TEAMS
                WHERE TRAINER_ID = $1;
        `,
			[trainerId]
		);

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(400);
	}
});

app.post("/teams/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;
		const formData = req.body;

		const { rows } = await pool.query(
			`
            INSERT INTO 
            TEAMS(TRAINER_ID, TEAM_NAME)
            VALUES($1, $2) RETURNING *;
        `,
			[trainerId, formData.teamName]
		);

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.detail);
	}
});

app.get("/team-details/:teamId", async (req, res) => {
	try {
		const { teamId } = req.params;

		const { rows } = await pool.query(
			`
            SELECT T.TEAM_NAME, OP.NICKNAME, P.*
                FROM TEAMS T
                JOIN POKEMON_IN_TEAM PIT
                    ON T.ID = PIT.TEAM_ID
                JOIN OWNED_POKEMONS OP
                    ON PIT.OWNED_POKEMON_ID = OP.ID
                JOIN POKEMONS P
                    ON OP.POKEMON_ID = P.POKEMON_ID
                WHERE TEAM_ID = $1;
        `,
			[teamId]
		);

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(400);
	}
});

app.post("/add-pokemon-to-team/:teamId", async (req, res) => {
	try {
		const { teamId } = req.params;
		const formData = req.body;

		const { rows } = await pool.query(
			`
            INSERT INTO 
            POKEMON_IN_TEAM(TEAM_ID, OWNED_POKEMON_ID)
            VALUES($1, $2) RETURNING *;
        `,
			[teamId, formData.ownedPokemonId]
		);

		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.detail);
	}
});

app.get("/trainers", async (req, res) => {
	try {
		const { rows } = await pool.query(`
            SELECT *
                FROM TRAINERS;
        `);

		console.log(rows);

		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(400);
	}
});

app.post("/trainers", async (req, res) => {
	try {
		const formData = req.body;

		const { rows } = await pool.query(
			`
            INSERT INTO
                TRAINERS(NAME, PASSWORD)
                VALUES ($1, $2) RETURNING *;
        `,
			[formData.name, formData.password]
		);

		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.detail);
	}
});

// Server Start
app.listen(PORT, () => {
	console.log(`Server Started on https://localhost:${PORT}`);
});
