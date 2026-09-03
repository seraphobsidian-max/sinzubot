const Thread = require("../models/Thread");

module.exports = async function ({ api, event }) {
	const { threadID, body, type, logMessageType, logMessageData } = event;

	// Lock GC Name logic
	if (type === "event" && logMessageType === "log:thread-name") {
		try {
			const threadData = await Thread.findOne({ threadID });
			const lockedName = threadData?.settings?.lockedGcName;

			if (lockedName && logMessageData.name !== lockedName) {
				api.setTitle(lockedName, threadID, () => {
					api.sendMessage(`⚠️ Naka-lock ang pangalan ng GC na ito bilang: "${lockedName}". Ibinalik sa dati!`, threadID);
				});
			}
		} catch (err) {
			console.error("Lock GC Event Error:", err);
		}
	}

	// Auto replies
	if (type === "message" || type === "message_reply") {
		if (!body) return;
		const lower = body.toLowerCase().trim();

		const replies = {
			"bot": "🤖 Hello! Ako si **SinzuBot**, ready mag-serve!",
			"prefix": "📌 Ang aking prefix ay `!` (Halimbawa: !setallnicknames, !lockgcname)",
			"kumusta": " Mabuti naman! Kamusta ka rin?",
			"sinzubot": " SinzuBot at your service!"
		};

		if (replies[lower]) {
			api.sendMessage(replies[lower], threadID);
		}
	}
};
