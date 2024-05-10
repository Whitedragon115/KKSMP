const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Rcon } = require('rcon-client');
const f = require('../../function/whitelist.js')
const { ServerPort, ServerRconIp, ServerRconPassword, AdminRoleId } = require('../../config.json')
const { GetUUID, GetIGN } = require('../../function/minecraft.js');
const { InviteGuild } = require('discord.js');

const rcon = new Rcon({
    port: ServerPort,
    host: ServerRconIp,
    password: ServerRconPassword
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mc')
        .setDescription('Minecraft punishment command')
        .setDMPermission(false)
        .addSubcommandGroup(group => group
            .setName('ban')
            .setDescription('Ban a user or a account')
            .addSubcommand(subcommand => subcommand
                .setName('user')
                .setDescription('Ban a user')
                .addUserOption(options => options
                    .setName('user')
                    .setDescription('user you want to ban')
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('account')
                .setDescription('Ban a account')
                .addStringOption(options => options
                    .setName('ign')
                    .setDescription('ign you want to ban')
                    .setRequired(true)
                )
            )
        )
        .addSubcommandGroup(group => group
            .setName('unban')
            .setDescription('Unban a user or a account')
            .addSubcommand(subcommand => subcommand
                .setName('user')
                .setDescription('Unban a user')
                .addUserOption(options => options
                    .setName('user')
                    .setDescription('user you want to unban')
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('account')
                .setDescription('unBan a account')
                .addStringOption(options => options
                    .setName('ign')
                    .setDescription('ign you want to unban')
                    .setRequired(true)
                )
            )
        )
    ,

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommandGroup() + interaction.options.getSubcommand()
        const user = interaction.options.getUser('user');
        const ign = interaction.options.getString('ign')?.replace(/\s/g, '').toLowerCase();
        const ignuuid = await GetUUID(ign)

        const getuserac = await client.db.get('Account').then(res => { return res.find(arr => arr.id == user?.id) })
        const getacowner = await client.db.get('Account').then(res => { return res.find(arr => arr.ign.some(ign => ign == ignuuid) == true) })

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        }

        await interaction.deferReply()

        switch (subcommand) {
            case 'banuser':
                banuser()
                break;
            case 'banaccount':
                banaccount()
                break;
            case 'unbanuser':
                unbanuser()
                break;
            case 'unbanaccount':
                unbanaccount()
                break;
            default:
                break;
        }

        //================Function================


        async function banuser() {
            if (!getuserac) {
                return interaction.editReply({ content: `此使用者沒有註冊過遊戲帳號`, ephemeral: true })
            } else if (getuserac.ban) {
                return interaction.editReply({ content: `此使用者已經被封鎖`, ephemeral: true })
            }

            const embed = new EmbedBuilder()
                .setTitle('Minecraft Ban')
                .setDescription(`使用者 \`${user.username}\` 的所有遊戲帳號已經被移除了\n> *旗下帳號有*`)
                .addFields()
                .setTimestamp()

            const ignlist = getuserac.ign
            await rcon.connect()

            for (let i = 0; i < ignlist.length; i++) {
                const getign = await GetIGN(ignlist[i])

                await rcon.send(`whitelist remove ${getign}`)
                await rcon.send(`ban ${getign}`)
                embed.addFields({ name: `帳號 \`< ${i + 1} >\``, value: `\`${getign}\``, inline: true })
            }
            rcon.end()

            await interaction.editReply({ embeds: [embed], ephemeral: false })

            const userac = await client.db.get('Account').then(res => { return res.findIndex(arr => arr.id == user.id) })
            let getac = await client.db.get(`Account`).then(res => { return res })
            getac[userac].ban = true
            await client.db.set(`Account`, getac)

        }

        async function banaccount() {

            if (getacowner?.ban) {
                return interaction.editReply({ content: `此遊戲帳號已經被封鎖`, ephemeral: true })
            }

            const embed = new EmbedBuilder()
                .setTitle('Minecraft Ban')
                .setDescription(`遊戲帳號 \`${ign}\` 已經被封鎖了`)

            if (getacowner) {
                embed.addFields({ name: '帳號所有者', value: `<@${getacowner.id}>`, inline: true })
            }

            await rcon.connect()
            await rcon.send(`whitelist remove ${ign}`)
            await rcon.send(`ban ${ign}`)
            rcon.end()

            await interaction.editReply({ embeds: [embed], ephemeral: false })
        }

        async function unbanuser() {
            if (!getuserac) {
                return interaction.editReply({ content: `此使用者沒有註冊過遊戲帳號`, ephemeral: true })
            } else if (!getuserac.ban) {
                return interaction.editReply({ content: `此使用者沒有被封鎖`, ephemeral: true })
            }

            const embed = new EmbedBuilder()
                .setTitle('Minecraft Unban')
                .setDescription(`使用者 \`${user.username}\` 的所有遊戲帳號已經被解除封鎖了\n> *旗下帳號有*`)
                .addFields()
                .setTimestamp()

            const ignlist = getuserac.ign
            await rcon.connect()
            for (let i = 0; i < ignlist.length; i++) {
                const getign = await GetIGN(ignlist[i])
                await rcon.send(`pardon ${getign}`)
                await rcon.send(`whitelist add ${getign}`)
                embed.addFields({ name: `帳號 \`< ${i + 1} >\``, value: `\`${getign}\``, inline: true })
            }
            rcon.end()

            await interaction.editReply({ embeds: [embed], ephemeral: false })

            const userac = await client.db.get('Account').then(res => { return res.findIndex(arr => arr.id == user.id) })
            let getac = await client.db.get(`Account`).then(res => { return res })
            getac[userac].ban = false
            await client.db.set(`Account`, getac)
        }

        async function unbanaccount() {

            const embed = new EmbedBuilder()
                .setTitle('Minecraft Unban')
                .setDescription(`遊戲帳號 \`${ign}\` 已經被解除封鎖了`)

            if (getacowner) {
                embed.addFields({ name: '帳號所有者', value: `<@${getacowner.id}>`, inline: true })
            }

            await rcon.connect()
            await rcon.send(`pardon ${ign}`)
            await rcon.send(`whitelist add ${ign}`)
            rcon.end()

            await interaction.editReply({ embeds: [embed], ephemeral: false })
        }

    },
};