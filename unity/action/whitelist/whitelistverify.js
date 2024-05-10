const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')
const f = require('../../../function/whitelist.js')
const { Rcon } = require('rcon-client');
const { ServerPort, ServerRconIp, ServerRconPassword, AdminRoleId } = require('../../../config.json')

const rcon = new Rcon({
    port: ServerPort,
    host: ServerRconIp,
    password: ServerRconPassword
})


module.exports = {
    customId: 'whitelist-confirm',
    async execute(interaction, client) {


        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**L 別再亂按了**`, ephemeral: true })
        }

        const userEmbed = interaction.message.embeds[0];
        const userid = userEmbed.fields[2].value.match(/`(.+?)`/)[1];
        const userign = userEmbed.fields[0].value.match(/`(.+?)`/)[1];
        const user = interaction.guild.members.cache.find(m => m.user.id === userid);

        const row = new ActionRowBuilder()
        const embed = new EmbedBuilder()
            .setTitle('白名單申請')
            .setDescription(`使用者 ${user} 的遊戲帳號 \`${userign}\` 已經被加入白名單了\n`)
            .setTimestamp()

        const button = new ButtonBuilder()
            .setLabel("E驗證")
            .setCustomId('whitelist-confirm')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)


        await rcon.connect()
        await rcon.send(`whitelist add ${userign}`)
        rcon.end()

        user.send({ embeds: [embed] })

        row.addComponents(button)
        await interaction.update({ embeds: [embed], components: [row] })

    }
}