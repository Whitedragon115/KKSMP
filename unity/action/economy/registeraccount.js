const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')
const { GetIGN } = require('../../../function/minecraft.js')

module.exports = {
    customId: 'economy-select',
    async execute(interaction, client) {

        //[{ id: '1234567890', ign: "abcdefg", money: 0, time: xxxxxxx }, { id: '0987654321', ign: "gfedcba", money: 0 , time: xxxxxxx }]
        const checkuserregister = await client.db.get('economy').then(res => { return res?.find(arr => arr.id == interaction.user.id) })

        if (checkuserregister) return interaction.reply({ content: `**你已經註冊過經濟帳號了**`, ephemeral: true })

        const registerign = await GetIGN(interaction.values[0])

        const row = new ActionRowBuilder()
        const button = new ButtonBuilder()
            .setCustomId('economy-register')
            .setLabel('確認註冊')
            .setStyle(ButtonStyle.Primary)
            .setEmoji({ name: '✅' })
            .setDisabled(false)
        row.addComponents(button)

        const embed = new EmbedBuilder()
            .setTitle('遊戲帳號註冊')
            .setDescription(`**確認要註冊遊戲帳號 [\`${registerign}\`] 嗎?**`)
            .setColor(0xFF0000)
            .setTimestamp()

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

    }
}