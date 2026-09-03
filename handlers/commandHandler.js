const fs = require("fs");
const path = require("path");

const commands = new Map();

// Dynamic command loading
const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const commandName = file.replace(".js", "");
	const commandModule = require(`../commands/${file}`);
	commands.set(commandName, commandModule);
}

module.exports = async function ({ api, event }) {
	const { body, type } = event;
	if ((type !== "message" && type !== "message_reply") || !body) return;

	const prefix = process.env.PREFIX || "!";
	if (!body.startsWith(prefix)) return;

	const args = body.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (commands.has(commandName)) {
		try {
			const command = commands.get(commandName);
			await command({ api, event, args });
		} catch (error) {
			console.error(`Error executing command ${commandName}:`, error);
			api.sendMessage("❌ Nagkaroon ng error sa pagpapatakbo ng command.", event.threadID);
		}
	}
};
