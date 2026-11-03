module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "ChekenGod",
    countDown: 5,
    role: 0,
    shortDescription: "list of commands",
    longDescription: "list of all bot commands by category",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ message, args, commandName, api, event }) {
    const cmds = global.GoatBot.commands;
    const categories = {};

    for (const [name, cmd] of cmds) {
      const cat = cmd.config.category || "OTHER";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    if (args[0]) {
      const cmd = cmds.get(args[0].toLowerCase());
      if (!cmd) return message.reply(`Command "${args[0]}" not found.`);
      const c = cmd.config;
      return message.reply(`Name: ${c.name}\nCategory: ${c.category}\nGuide: ${c.guide}\nDesc: ${c.longDescription}`);
    }

    let msg = "╔════ COMMAND LIST ════╗\n\n";
    for (const cat in categories) {
      msg += `【 ${cat.toUpperCase()} 】\n${categories[cat].map(c => `• ${c}`).join("\n")}\n\n`;
    }
    msg += `╚═══════════════════╝\nTotal: ${cmds.size} commands\nUse: -help [command name]`;
    return message.reply(msg);
  }
};
