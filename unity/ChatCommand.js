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








        /*{
            channelId: '1164013973000175636',
            guildId: '1163047681283850300',
            id: '1194186685819404328',
            createdTimestamp: 1704786692815,
            type: 0,
            system: false,
            content: 'e',
            author: User {
              id: '968013433482141696',
              bot: false,
              system: false,
              flags: UserFlagsBitField { bitfield: 4194560 },
              username: 'whitedragon115',
              globalName: 'Whitedragon',
              discriminator: '0',
              avatar: '092cb976f9aff16af499fa7903bec13c',
              banner: undefined,
              accentColor: undefined,
              avatarDecoration: null
            },
            pinned: false,
            tts: false,
            nonce: '1194186683713585152',
            embeds: [],
            components: [],
            attachments: Collection(0) [Map] {},
            stickers: Collection(0) [Map] {},
            position: null,
            roleSubscriptionData: null,
            resolved: null,
            editedTimestamp: null,
            reactions: ReactionManager { message: [Circular *1] },
            mentions: MessageMentions {
              everyone: false,
              users: Collection(0) [Map] {},
              roles: Collection(0) [Map] {},
              _members: null,
              _channels: null,
              _parsedUsers: null,
              crosspostedChannels: Collection(0) [Map] {},
              repliedUser: null
            },
            webhookId: null,
            groupActivityApplication: null,
            applicationId: null,
            activity: null,
            flags: MessageFlagsBitField { bitfield: 0 },
            reference: null,
            interaction: null
          }*/
    },
};
