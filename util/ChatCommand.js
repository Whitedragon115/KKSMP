const { Events } = require('discord.js');
const { AdminRoleId } = require('../config.json');
const { CreateWhitelistPanel } = require('../function/whitelist.js');
const { CreateConsolePanel } = require('../function/minecraftconsole.js')
const { CreateEconomyRegisterPanel } = require('../function/economy.js')

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        const sender = message.guild.members.cache.get(message.author.id);
        const msg = message.content;

        if (message.author.bot) return;
        if (message.channel.type === 'DM') return;
        if (!sender.roles.cache.some((rl) => rl.id == AdminRoleId)) return;
        if (!msg.startsWith('[') || !msg.endsWith(']')) return;
        const command = msg.replace(/[\[\]]/g, '');

        switch (command) {
            case 'ping':
                message.reply(`Pong! my ping to discord is ${message.createdTimestamp - Date.now()}ms.`);
                break;
            case 'whitelist':
                CreateWhitelistPanel(message, message.reference);
                break;
            case 'gameconsole':
                CreateConsolePanel(message, message.reference);
                break;
            case 'RE':
            case 'registereconomy':
                CreateEconomyRegisterPanel(message, message.reference);
                break;
            default:
        }
    },
};
