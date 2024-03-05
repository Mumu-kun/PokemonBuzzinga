/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				attack: "attack 0.5s ease-in-out forwards",
				defend: "defend 0.5s ease-in-out forwards",
				progressBar: "progressBar 2s linear infinite",
			},
			keyframes: {
				attack: {
					"0%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px) scale(1.1)" },
					"100%": { transform: "translateY(0)" },
				},

				defend: {
					"50%": { filter: "hue-rotate(180deg)" },
				},
				progressBar: {
					"0%": { width: "0%" },
					"100%": { width: "100%" },
				},
			},
		},
	},
	plugins: [
		// ...
		require("tailwind-scrollbar"),
	],
};
