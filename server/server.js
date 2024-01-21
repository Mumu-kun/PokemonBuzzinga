import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import "dotenv/config";
import pool from "./db.js";

const PORT = process.env.PORT || 8080;

const app = express();

const saltRounds = 10;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/pokemons", async (req, res) => {
	try {
		const { rows } = await pool.query(`
            SELECT *
                FROM POKEMONS;
        `);

		const pokemonList = rows.map((data) => {
			const { pokemon_id, name, hp, attack, defense, speed, sp_attack, sp_defense, total } = data;
			return {
				pokemon_id,
				name,
				stats: {
					hp,
					attack,
					defense,
					speed,
					sp_attack,
					sp_defense,
					total,
				},
			};
		});

		res.status(200).json(pokemonList);
	} catch (err) {
		console.error(err);
	}
});

app.get("/api/pokemons/:id", async (req, res) => {
	try {
		const pokemon_id = req.params.id;
		const { rows } = await pool.query(
			`
            SELECT *
                FROM POKEMONS
                WHERE POKEMON_ID = $1;
        `,
			[pokemon_id]
		);

		if (rows.length == 0) {
			const errMsg = `Pokemon with ID:${pokemon_id} does not exist.`;
			throw new Error(errMsg);
		}

		const { name, hp, attack, defense, speed, sp_attack, sp_defense, total } = rows[0];

		const pokemonInfo = {
			pokemon_id,
			name,
			stats: {
				hp,
				attack,
				defense,
				speed,
				sp_attack,
				sp_defense,
				total,
			},
		};

		console.log(pokemonInfo);
		res.status(200).json(pokemonInfo);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
});

app.post("/api/login", async (req, res) => {
	try {
		const formData = req.body;

		console.log(formData);

		const { rows } = await pool.query(
			`
            SELECT *
            FROM TRAINERS
            WHERE NAME = $1;
        `,
			[formData.name]
		);

		if (rows.length == 0) {
			const errMsg = `Trainer does not exist.`;
			throw new Error(errMsg);
		}

		const passMatch = await bcrypt.compare(formData.password, rows[0].password);
		if (!passMatch) {
			const errMsg = `Password does not match.`;
			throw new Error(errMsg);
		}

		console.log(rows[0]);
		res.status(200).json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.message);
	}
});

app.post("/api/signup", async (req, res) => {
	try {
		const formData = req.body;

		console.log(formData);

		const hashedPass = await bcrypt.hash(formData.password, saltRounds);

		const { rows } = await pool.query(
			`
			INSERT INTO
			TRAINERS(NAME, PASSWORD)
			VALUES ($1, $2) RETURNING *;
        `,
			[formData.name, hashedPass]
		);

		console.log(rows[0]);
		res.status(200).json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.message);
	}
});

app.get("/api/owned-pokemons/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;

		const { rows } = await pool.query(
			`
            SELECT OP.ID, OP.POKEMON_ID, OP.NICKNAME, PIT.TEAM_ID
                FROM OWNED_POKEMONS OP
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

app.post("/api/owned-pokemons/:trainerId", async (req, res) => {
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

app.get("/api/teams/:trainerId", async (req, res) => {
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

app.post("/api/teams/:trainerId", async (req, res) => {
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

app.get("/api/team-details/:teamId", async (req, res) => {
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

app.post("/api/add-pokemon-to-team/:teamId", async (req, res) => {
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

app.get("/api/trainers", async (req, res) => {
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

app.post("/api/trainers", async (req, res) => {
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
	console.log(`Server Started on http://localhost:${PORT}`);
});
