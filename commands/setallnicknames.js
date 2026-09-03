module.exports = async function ({ api, event, args }) {
	const { threadID } = event;
	const newNickname = args.join(" ");

	if (!newNickname) {
		return api.sendMessage("⚠️ Paki-lagay ang bagong palayaw. Example: !setallnicknames Member", threadID);
	}

	api.sendMessage("⏳ Sinisimulan na ang pagpalit ng palayaw ng lahat...", threadID);

	api.getThreadInfo(threadID, async (err, info) => {
		if (err) {
			console.error(err);
			return api.sendMessage("❌ Nagkaroon ng error sa pagkuha ng thread info.", threadID);
		}

		const participantIDs = info.participantIDs;

		for (const userID of participantIDs) {
			await new Promise((resolve) => setTimeout(resolve, 1200));
			api.changeNickname(newNickname, threadID, userID);
		}

		setTimeout(() => {
			api.sendMessage(` Naipalit na ang palayaw ng lahat sa: "${newNickname}"`, threadID);
		}, participantIDs.length * 1200 + 1000);
	});
};
