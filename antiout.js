module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "ChekenGod",
    countDown: 5,
    role: 1, // 1 = GC admin only
    shortDescription: "Prevent members from leaving",
    longDescription: "When someone leaves, bot adds them back",
    category: "box chat",
    guide: "{pn} on / off"
  },

  onStart: async function({ api, event, args, threadsData }) {
    if (!args[0]) return api.sendMessage("Use: -antiout on / off", event.threadID);

    const threadData = await threadsData.get(event.threadID);
    const isOn = args[0].toLowerCase() === "on";

    await threadsData.set(event.threadID, {
      ...threadData,
      data: {
        ...threadData.data,
        antiout: isOn
      }
    });

    return api.sendMessage(isOn ? "✅ Antiout is now ON - No one can leave!" : "❌ Antiout is now OFF", event.threadID);
  },

  // This handles when someone leaves
  onChat: async function() {},
  
  onEvent: async function({ api, event, threadsData }) {
    if (event.logMessageType !== "log:unsubscribe") return;
    
    const threadData = await threadsData.get(event.threadID);
    if (!threadData.data?.antiout) return;

    const leftID = event.logMessageData.leftParticipantFbId;
    if (leftID == api.getCurrentUserID()) return;

    // Add them back
    try {
      await api.addUserToGroup(leftID, event.threadID);
      const info = await api.getUserInfo(leftID);
      const name = info[leftID]?.name || "User";
      api.sendMessage(`Antiout: ${name} tried to leave but I added them back 😎`, event.threadID);
    } catch (e) {
      api.sendMessage(`Antiout: Someone left but I failed to add them back - I need to be GC admin!`, event.threadID);
    }
  }
};
