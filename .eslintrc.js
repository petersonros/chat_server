module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: "eslint:recommended",
	overrides: [
	],
	parserOptions: {
		ecmaVersion: "latest"
	},
	rules: {

		"linebreak-style": [
			"error",
			"windows"
		],
		quotes: [
			"error",
			"double"
		],
		semi: [
			"error",
			"always"
		]
	}
};

export default App();