const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const { Rcon } = require('rcon-client');
const { ServerPort, ServerRconIp, ServerRconPassword, AdminRoleId } = require('../../config.json')
const { GetUUID, GetIGN } = require('../../function/minecraft.js')


const rcon = new Rcon({
    port: ServerPort,
    host: ServerRconIp,
    password: ServerRconPassword
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addwhitelist')
        .setDescription('add whitelist to a player')
        .setDMPermission(false)
        .addUserOption(options => options
            .setName('user')
            .setDescription('user you want to get')
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName('ign')
            .setDescription('ign you want to add')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const ign = interaction.options.getString('ign')?.replace(/\s/g, '').toLowerCase();
        const ignuuid = await GetUUID(ign)

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        } else if (!user) {
            return interaction.reply({ content: `You didn't enter user`, ephemeral: true })
        }

        const getuserac = await client.db.get('Account').then(res => { return res.find(arr => arr.id == user.id) })
        const findregistered = await client.db.get('Account').then(res => { return res.some(arr => arr.ign.some(id => id == ignuuid) == true) })

        if (findregistered) return interaction.reply({ content: `遊戲帳號已被註冊`, ephemeral: true })
        if (!/^[a-zA-Z0-9_]+$/.test(ign)) return interaction.reply({ content: `遊戲id只能包含英文數字和底線`, ephemeral: true })

        const userindex = await client.db.get('Account').then(res => { return res.findIndex(arr => arr.id == user.id) })

        if (getuserac) {
            let getac = await client.db.get(`Account`).then(res => { return res })
            getac[userindex].ign = [...getac[userindex].ign, ignuuid]
            await client.db.set(`Account`, getac)
        } else {
            const newaccdata = {
                id: user.id,
                ign: [ignuuid],
                ban: false
            }
            await client.db.push(`Account`, newaccdata)
        }

        await rcon.connect()
        await rcon.send(`whitelist add ${ign}`)
        rcon.end()

        const embed = new EmbedBuilder()
            .setTitle('加入白名單')
            .setDescription(`已經把你的id \`${ign}\` 加入白名單了喔`)

        await interaction.reply({ embeds: [embed], ephemeral: false })

    },
};