module.exports = {
  config: {
    name: "addmoney",
    version: "1.0",
    author: "you",
    countDown: 5,
    role: 2, // 2 = only you (adminBot) can use
    shortDescription: "add money to user",
    longDescription: "Add money to user balance",
    category: "economy",
    guide: "{pn} @tag [amount] or {pn} [uid] [amount]"
  },

  onStart: async function ({ api, event, args, usersData }) {
    let targetID, amount;

    // Get target UID
    if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } else {
      targetID = args[0];
    }

    amount = parseInt(args[args.length - 1]);

    if (!targetID || isNaN(amount)) {
      return api.sendMessage("Usage: -addmoney @user 1000\nor -addmoney 615xxxx 1000", event.threadID);
    }

    if (amount <= 0) return api.sendMessage("Amount must be positive!", event.threadID);

    try {
      const userData = await usersData.get(targetID);
      const currentMoney = userData.money || 0;
      const newMoney = currentMoney + amount;
      
      await usersData.set(targetID, {
        money: newMoney
      });

      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || targetID;

      return api.sendMessage(`✅ Added $${amount} to ${name}\nNew balance: $${newMoney}`, event.threadID);
    } catch (e) {
      return api.sendMessage(`Error: ${e.message}`, event.threadID);
    }
  }
};
