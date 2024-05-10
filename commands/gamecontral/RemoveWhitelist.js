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
        .setName('removewhitelist')
        .setDescription('remove whitelist to a player')
        .setDMPermission(false)
        .addStringOption(options => options
            .setName('ign')
            .setDescription('ign you want to remove')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const ign = interaction.options.getString('ign')?.replace(/\s/g, '').toLowerCase();
        const ignuuid = await GetUUID(ign)

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        } else if (!/^[a-zA-Z0-9_]+$/.test(ign)) {
            return interaction.reply({ content: `遊戲id只能包含英文數字和底線`, ephemeral: true })
        }
        
        const getuserac = await client.db.get('Account').then(res => { return res.find(arr => arr.ign.some(id => id == ignuuid) == true) })

        const embed = new EmbedBuilder()
            .setTitle('移除白名單')
            .setDescription(`已移除使用者 ${getuserac?.id ? `<@${getuserac?.id}>` : "\`未註冊使用者\`"} 之遊戲帳號 \`${ign}\` 的白名單`)

        if (getuserac) {
            let getac = await client.db.get(`Account`).then(res => { return res })
            const userindex = await client.db.get('Account').then(res => { return res.findIndex(arr => arr.id == getuserac.id) })
            getac[userindex].ign = getuserac.ign.filter(id => id != ignuuid)
            await client.db.set(`Account`, getac)
        }

        await rcon.connect()
        await rcon.send(`kick ${ign}`)
        await rcon.send(`whitelist remove ${ign}`)
        rcon.end()

        await interaction.reply({ embeds: [embed], ephemeral: false })

    },
};