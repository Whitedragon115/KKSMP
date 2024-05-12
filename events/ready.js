const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
const { BotCondition } = require('../config.json')
const { color } = require('console-log-colors')


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setPresence({ activities: [{ name: 'KKSMP!', type: ActivityType.Watching }], status: PresenceUpdateStatus.DoNotDisturb })

        const guild = client.guilds.cache.get(process.env.GUILDID);
        const memberCount = guild.memberCount;

        const login_string = `${color.green('Login : Bot')} ${color.yellow(client.user.tag)}  ║  ${color.green('BotID :')} ${color.yellow(process.env.CLEINTID)}  ║  ${color.green('Server :')} ${color.yellow(guild.name)}  ║  ${color.green('Server Member :')} ${color.yellow(memberCount)}`
        console.log(login_string);

    },
};