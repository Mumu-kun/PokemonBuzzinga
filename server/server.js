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
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api/pokemons", async (req, res) => {
	try {
		const { start = 1, limit = 50 } = req.query;

		const { rows } = await pool.query(
			`
            SELECT *
                FROM POKEMONS
				ORDER BY POKEMON_ID
				LIMIT $1 OFFSET $2;
        `,
			[limit, start - 1]
		);

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

app.get("/api/pokemons/:id/image", async (req, res) => {
	try {
		const pokemon_id = req.params.id;
		const { rows } = await pool.query(
			`
			SELECT *
				FROM POKEMON_IMAGES
				where POKEMON_ID = $1;
				`,
			[pokemon_id]
		);

		if (rows.length == 0) {
			const errMsg = `Pokemon with ID:${pokemon_id} does not exist.`;
			throw new Error(errMsg);
		}

		const { img, ext } = rows[0];

		res.set("Content-Type", `image/${ext}`);
		res.send(img);
	} catch (err) {
		console.error(err);
		res.status(400).send(err);
	}
});

app.get("/api/pokemons/:id", async (req, res) => {
	try {
		const pokemon_id = req.params.id;
		const { rows } = await pool.query(
			`
            SELECT *
                FROM POKEMONS P
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

		// console.log(pokemonInfo);
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
			TRAINERS(NAME, PASSWORD, REGION_ID)
			VALUES ($1, $2, $3) RETURNING *;
        `,
			[formData.name, hashedPass, formData.region_id]
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

app.delete("/api/owned-pokemons/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;
		const formData = req.body;

		const { rows } = await pool.query(
			`
            DELETE FROM 
            OWNED_POKEMONS
            WHERE ID = $1 RETURNING *;
        `,
			[formData.pokemonId]
		);

		// console.log(rows);
		res.status(200).send(`Freed ${rows[0].nickname}`);
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

		// console.log(rows);
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

		// console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.detail);
	}
});

app.delete("/api/teams/:trainerId", async (req, res) => {
	try {
		const { trainerId } = req.params;
		const formData = req.body;
		console.log(formData);

		await pool.query(
			`
				DELETE FROM
				POKEMON_IN_TEAM
				WHERE TEAM_ID = $1;
			`,
			[formData.teamId]
		);

		const { rows } = await pool.query(
			`
            DELETE FROM 
            TEAMS
            WHERE ID = $1 RETURNING *;
        `,
			[formData.teamId]
		);

		// console.log(rows);
		res.status(200).send(`Deleted Team ${rows[0]?.team_name}`);
	} catch (err) {
		console.error(err);
		res.status(400).send(err.detail);
	}
});

app.get("/api/teams/:teamId/pokemons", async (req, res) => {
	try {
		const { teamId } = req.params;

		const { rows } = await pool.query(
			`
            SELECT OP.ID, OP.NICKNAME, P.POKEMON_ID, P.TOTAL
                FROM TEAMS T
                JOIN POKEMON_IN_TEAM PIT
                    ON T.TEAM_ID = PIT.TEAM_ID
                JOIN OWNED_POKEMONS OP
                    ON PIT.OWNED_POKEMON_ID = OP.ID
				JOIN POKEMONS P
                    ON OP.POKEMON_ID = P.POKEMON_ID
                WHERE T.TEAM_ID = $1;
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

app.get("/api/teams/:teamId/details", async (req, res) => {
	try {
		const { teamId } = req.params;

		const { rows: rowsTeam } = await pool.query(
			`
            SELECT TM.*, TR.NAME
                FROM TEAMS TM
				JOIN TRAINERS TR ON (TM.TRAINER_ID = TR.ID)
                WHERE TM.TEAM_ID = $1;
        `,
			[teamId]
		);

		const { rows: rowsDetails } = await pool.query(
			`
            SELECT OP.ID, OP.NICKNAME, P.*
                FROM TEAMS T
                JOIN POKEMON_IN_TEAM PIT
                    ON T.TEAM_ID = PIT.TEAM_ID
                JOIN OWNED_POKEMONS OP
                    ON PIT.OWNED_POKEMON_ID = OP.ID
                JOIN POKEMONS P
                    ON OP.POKEMON_ID = P.POKEMON_ID
                WHERE T.TEAM_ID = $1;
        `,
			[teamId]
		);

		// console.log(rows);
		res.status(200).json({ ...rowsTeam[0], pokemons: rowsDetails });
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
            	VALUES($1, $2)
			ON CONFLICT (OWNED_POKEMON_ID) DO UPDATE
				SET TEAM_ID = EXCLUDED.TEAM_ID
			RETURNING *;
        `,
			[teamId, formData.ownedPokemonId]
		);

		// console.log(rows);
		res.status(200).json(rows[0]);
	} catch (err) {
		console.error(err);
		res.status(400).send({ message: err.detail });
	}
});

app.delete("/api/delete-pokemon-from-team/", async (req, res) => {
	try {
		const formData = req.body;

		const { rows } = await pool.query(
			`
            DELETE FROM 
            	POKEMON_IN_TEAM
            	WHERE OWNED_POKEMON_ID = $1
			RETURNING *;
        `,
			[formData.ownedPokemonId]
		);

		if (rows.length == 0) {
			throw Error("No pokemon to remove");
		}

		// console.log(rows);
		res.status(200).send("Pokemon successfully removed");
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

// Regions
app.get("/api/regions", async (req, res) => {
	try {
		const { rows } = await pool.query(`
			SELECT *
				FROM REGIONS
				ORDER BY REGION_ID;
		`);
		console.log(rows);

		res.status(200).json(rows);
	} catch (err) {
		console.error(err);
		res.sendStatus(400);
	}
});
app.get("/api/pokemons-dets/:id", async (req, res) => {
    try {
        const pokemon_id = req.params.id;

        // Query to retrieve Pokemon details including image
        const { rows: pokemonRows } = await pool.query(
            `
            SELECT P.*, PI.img, PI.ext
            FROM pokemons P
            LEFT JOIN pokemon_images PI ON P.pokemon_id = PI.pokemon_id
            WHERE P.pokemon_id = $1;
            `,
            [pokemon_id]
        );

        if (pokemonRows.length === 0) {
            const errMsg = `Pokemon with ID:${pokemon_id} does not exist.`;
            throw new Error(errMsg);
        }

        const { name, hp, attack, defense, speed, sp_attack, sp_defense, total, type_1, type_2, region_id, img, ext } = pokemonRows[0];

        const { rows: regionRows } = await pool.query(
            `
            SELECT region_name
            FROM regions
            WHERE region_id = $1;
            `,
            [region_id]
        );

        if (regionRows.length === 0) {
            throw new Error(`Region with ID:${region_id} does not exist.`);
        }

        const region = regionRows[0].region_name;

        const { rows: typeRows1 } = await pool.query(
            `
            SELECT type_name
            FROM type
            WHERE type_id IN ($1);
            `,
            [type_1]
        );

        const type1 = typeRows1[0].type_name;

        let type2 = null;
        if (type_2) {
            const { rows: typeRows2 } = await pool.query(
                `
                SELECT type_name
                FROM type
                WHERE type_id IN ($1);
                `,
                [type_2]
            );
            type2 = typeRows2[0].type_name;
        }

        const { rows: abilityRows } = await pool.query(
            `
            SELECT A.ability_id, A.ability, A.description
            FROM abilities A
            WHERE A.ability_id IN (
                SELECT ability_id
                FROM allowed_abilities
                WHERE pokemon_id = $1
            );
            `,
            [pokemon_id]
        );

        if (abilityRows.length < 1 || abilityRows.length > 2) {
            throw new Error(`Invalid number of abilities for Pokemon with ID:${pokemon_id}.`);
        }

        const abilities = abilityRows.map(({ ability_id, ability, description }) => ({
            ability_id,
            ability,
            description
        }));

        const { rows: moveRows } = await pool.query(
            `
            SELECT M.move_id, M.move_name, T.type_name AS move_type, M.category, M.power, M.accuracy
            FROM moves M
            JOIN type T ON M.type_id = T.type_id
            WHERE M.move_id IN (
                SELECT move_id
                FROM pokemon_movesets
                WHERE pokemon_id = $1
            );
            `,
            [pokemon_id]
        );

        const moves = moveRows.map(move => ({
            move_id: move.move_id,
            name: move.move_name,
            type: move.move_type,
            category: move.category,
            power: move.power,
            accuracy: move.accuracy
        }));

        const pokemonInfo = {
            pokemon_id,
            name,
            type1,
            type2,
            region,
            stats: {
                hp,
                attack,
                defense,
                speed,
                sp_attack,
                sp_defense,
                total,
            },
            moves,
            abilities,
            img: `data:image/${ext};base64,${img}`
        };

        res.status(200).json(pokemonInfo);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});







// Server Start
app.listen(PORT, () => {
	console.log(`Server Started on ${PORT}`);
});
