const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "welcome",
    version: "1.0",
    author: "GoatBot",
    category: "events"
  },

  onStart: async function({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName;
    const newMembers = event.logMessageData.addedParticipants;

    for (const member of newMembers) {
      if (member.userFbId == api.getCurrentUserID()) continue;

      const name = member.fullName;
      const memberCount = threadInfo.participantIDs.length;

      // --- Create Welcome Image ---
      try {
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, 800, 400);

        // Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Arial";
        ctx.fillText(`WELCOME!`, 300, 100);
        ctx.font = "30px Arial";
        ctx.fillText(`${name}`, 300, 160);
        ctx.font = "20px Arial";
        ctx.fillText(`to ${threadName}`, 300, 200);
        ctx.fillText(`You are member #${memberCount}`, 300, 240);

        // Avatar circle
        const avatarURL = `https://graph.facebook.com/${member.userFbId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avatar = await loadImage(avatarURL);
        ctx.save();
        ctx.beginPath();
        ctx.arc(150, 200, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 50, 100, 200, 200);
        ctx.restore();

        const imgPath = path.join(__dirname, "cache", `welcome_${member.userFbId}.png`);
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(imgPath, buffer);

        // Send with picture
        api.sendMessage({
          body: `Welcome ${name} 👋\nWelcome to ${threadName}!\nYou're member #${memberCount} 🎉`,
          attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath));

      } catch (e) {
        // If image fails, send text only
        api.sendMessage(`Welcome ${name} 👋 to ${threadName}! You're member #${memberCount}!`, event.threadID);
      }
    }
  }
};
api.changeNickname("Chekengod 🤖", event.threadID, api.getCurrentUserID());
