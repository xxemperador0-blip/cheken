module.exports = {
  config: {
    name: "autoreact",
    version: "1.0",
    author: "you",
    category: "events"
  },

  onStart: async function({ api, event, threadsData }) {
    // Toggle command if you want -autoreact on/off
    if (event.body && event.body.toLowerCase().startsWith("-autoreact")) {
      const args = event.body.split(" ");
      const isOn = args[1] === "on";
      const threadData = await threadsData.get(event.threadID);
      await threadsData.set(event.threadID, {
        ...threadData,
        data: { ...threadData.data, autoreact: isOn }
      });
      return api.sendMessage(isOn ? "✅ Autoreact ON" : "❌ Autoreact OFF", event.threadID);
    }
  },

  // This auto reacts to EVERY message
  onChat: async function({ api, event, threadsData }) {
    const threadData = await threadsData.get(event.threadID);
    // If you turned it off, don't react
    if (threadData.data?.autoreact === false) return;

    const emojis = ["❤️", "😆", "😮", "😢", "😡", "👍", "🥰", "🤣", "😍", "🔥"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    try {
      api.setMessageReaction(randomEmoji, event.messageID, () => {}, true);
    } catch (e) {}
  }
};
