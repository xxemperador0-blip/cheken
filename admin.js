module.exports = {
  config: {
    name: "admin",
    version: "1.0",
    author: "GoatBot",
    countDown: 5,
    role: 1, // 1 = GC admin only can use
    shortDescription: "Manage GC admins",
    longDescription: "Add, remove, list GC admins",
    category: "box chat",
    guide: "{pn} list | {pn} add @tag | {pn} remove @tag"
  },

  onStart: async function({ api, event, args }) {
    const threadID = event.threadID;

    // LIST ADMINS
    if (args[0] === "list" || args[0] === "l") {
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(a => a.id);
      let msg = "👑 GC ADMIN LIST:\n\n";
      for (let i = 0; i < adminIDs.length; i++) {
        const info = await api.getUserInfo(adminIDs[i]);
        const name = info[adminIDs[i]]?.name || adminIDs[i];
        msg += `${i + 1}. ${name}\n`;
      }
      return api.sendMessage(msg, threadID);
    }

    // ADD ADMIN
    if (args[0] === "add" || args[0] === "a") {
      let targetID;
      if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else {
        targetID = args[1];
      }
      if (!targetID) return api.sendMessage("Tag someone: -admin add @user", threadID);
      
      try {
        await api.changeAdminStatus(threadID, targetID, true);
        return api.sendMessage("✅ Added as GC admin!", threadID);
      } catch (e) {
        return api.sendMessage("Failed - Make bot GC admin first!", threadID);
      }
    }

    // REMOVE ADMIN
    if (args[0] === "remove" || args[0] === "r" || args[0] === "rem") {
      let targetID;
      if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else {
        targetID = args[1];
      }
      if (!targetID) return api.sendMessage("Tag someone: -admin remove @user", threadID);
      
      try {
        await api.changeAdminStatus(threadID, targetID, false);
        return api.sendMessage("✅ Removed from GC admin!", threadID);
      } catch (e) {
        return api.sendMessage("Failed - Make bot GC admin first!", threadID);
      }
    }

    return api.sendMessage("Usage:\n-admin list\n-admin add @user\n-admin remove @user", threadID);
  }
};
