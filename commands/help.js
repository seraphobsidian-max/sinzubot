module.exports = async function ({ api, event, args }) {
	const { threadID } = event;
	const prefix = process.env.PREFIX || "!";

	if (!args[0]) {
		const helpMessage = `
🤖 ═══ [ SINZUBOT HELP MENU ] ═══ 🤖

📌 Prefix: \`${prefix}\`

⚙️ LISTAHAN NG COMMANDS:

🔹 **${prefix}setallnicknames <bagong_nickname>**
   └ Baguhin ang palayaw ng LAHAT ng miyembro sa GC.

🔹 **${prefix}lockgcname <pangalan>**
   └ I-lock ang pangalan ng GC para hindi palitan ng iba.
   └ Gamitin ang \`${prefix}lockgcname unlock\` para tanggalin ang lock.

🔹 **${prefix}help [command]**
   └ Ipakita ang tulong o detalye ng isang command.

💬 **AUTO REPLIES:**
   └ Type "bot", "prefix", "kumusta", o "sinzubot"
`;
		return api.sendMessage(helpMessage, threadID);
	}
};
