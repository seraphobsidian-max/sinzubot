require("dotenv").config();
const login = require("@dongdev/fca-unofficial");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/database");

const handleEvent = require("./handlers/eventHandler");
const handleCommand = require("./handlers/commandHandler");

// Connect Database
connectDB();

const appStatePath = path.join(__dirname, "appstate.json");
if (!fs.existsSync(appStatePath)) {
	console.error("❌ Walang appstate.json! Paki-lagay ang iyong Facebook appstate.");
	process.exit(1);
}

const appState = JSON.parse(fs.readFileSync(appStatePath, "utf8"));

login({ appState }, (err, api) => {
	if (err) {
		console.error("❌ Login failed:", err);
		return;
	}

	console.log("🚀 SinzuBot successfully logged in!");

	api.setOptions({
		listenEvents: true,
		selfListen: false,
		autoMarkDelivery: false,
		forceLogin: true
	});

	api.listenMqtt(async (err, event) => {
		if (err) {
			console.error("MQTT Listen error:", err);
			return;
		}

		// Handle events (Auto-reply & GC name lock)
		await handleEvent({ api, event });

		// Handle chat commands
		await handleCommand({ api, event });
	});
});
