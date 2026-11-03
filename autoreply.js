module.exports = {
  config: {
    name: "autoreply",
    version: "1.0",
    author: "you",
    category: "FUN",
    role: 0
  },
  onChat: async function({ api, event }) {
    const msg = event.body?.toLowerCase();
    if (!msg) return;

    // === ADD YOUR AUTO REPLIES HERE ===
    if (msg.includes("hello") || msg.includes("hi")) {
      return api.sendMessage("hello dogsko I'm Chekengod bot!", event.threadID);
    }

    if (msg.includes("bot")) {
      return api.sendMessage("Nandito nako 😩👍🏿Type -help", event.threadID);
    }

    if (msg.includes("how are you")) {
      return api.sendMessage("I'm good! Fck u for asking 👍🏿", event.threadID);
    }

    if (msg.includes("good morning")) {
      return api.sendMessage("Good morning! Have a Bad day 👍🏿", event.threadID);
    }
    // === END ===

  },

  onStart: async function() {}
};
