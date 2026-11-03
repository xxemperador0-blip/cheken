const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0",
    author: "Meta AI style",
    countDown: 5,
    role: 0,
    shortDescription: "Chat with AI",
    longDescription: "Bot replies like Meta AI / ChatGPT",
    category: "ai",
    guide: "{pn} [your question] - Example: {pn} who are you?"
  },

  onStart: async function({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("Hi! I'm like Meta AI 🤖 Ask me anything!\n\nExample: -ai what is love?", event.threadID);

    try {
      api.sendMessage("🤖 Thinking...", event.threadID, async (err, info) => {
        // FREE AI API - like Meta AI
        const res = await axios.get(`https://api.dailydose.my.id/api/gpt?text=${encodeURIComponent(prompt)}`);
        const reply = res.data?.response || res.data?.answer || "Sorry, I can't think right now 😅";
        
        api.editMessage(reply, info.messageID);
      });
    } catch (e) {
      api.sendMessage("Error: AI is busy, try again later!", event.threadID);
    }
  },

  // Auto reply when someone says "bot" or replies to bot
  onChat: async function({ api, event }) {
    if (!event.body) return;
    const body = event.body.toLowerCase();
    
    // Reply if message starts with "ai" or mentions bot
    if (body.startsWith("ai ") || body.startsWith("bot ") || event.mentions[api.getCurrentUserID()]) {
      const prompt = event.body.replace(/ai |bot |@.*? /gi, "").trim();
      if (!prompt) return;

      try {
        const res = await axios.get(`https://api.dailydose.my.id/api/gpt?text=${encodeURIComponent(prompt)}`);
        const reply = res.data?.response || res.data?.answer || "Yes? 😊";
        api.sendMessage(reply, event.threadID, event.messageID);
      } catch (e) {}
    }
  }
};
