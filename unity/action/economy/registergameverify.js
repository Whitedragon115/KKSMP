const { ActionRowBuilder, ModalBuilder, TextInputBuilder, EmbedBuilder } = require('@discordjs/builders')
const { TextInputStyle } = require('discord.js')
const { GetUUID } = require('../../../function/minecraft.js')
const { SendCommand } = require('../../../function/rcon.js')

module.exports = {
    customId: 'economy-verify',
    async execute(interaction, client) {

        if (interaction.fields?.getTextInputValue('code')) return await verifycode()

        const modal = new ModalBuilder()
            .setCustomId('economy-verify')
            .setTitle('遊戲驗證')

        const code = new TextInputBuilder()
            .setCustomId('code')
            .setRequired(true)
            .setLabel('驗證碼')
            .setStyle(TextInputStyle.Short)
            .setMinLength(6)
            .setMaxLength(6)

        const actionone = new ActionRowBuilder().addComponents(code)

        modal.addComponents(actionone)
        return await interaction.showModal(modal)

        async function verifycode() {
            await interaction.deferReply({ ephemeral: true })
            const verifycode = interaction.fields.getTextInputValue('code')
            const checkuser = await client.db.get('verify').then(res => { return res.find(arr => arr.code == verifycode) })
            if (!checkuser || checkuser.id != interaction.user.id) return interaction.editReply({ content: `驗證碼錯誤`, ephemeral: true })

            const newdata = {
                id: interaction.user.id,
                ign: checkuser.ign.toLowerCase(),
                time: Date.now()
            }

            await client.db.push('economy', newdata)

            const embed = new EmbedBuilder()
                .setTitle('遊戲帳號註冊')
                .setDescription(`**遊戲帳號 [\`${checkuser.ign}\`] 註冊成功**\n> 以下為註冊資訊`)
                .addFields(
                    { name: '遊戲帳號', value: `\`${checkuser.ign}\``, inline: true },
                    { name: '註冊時間', value: new Date(newdata.time).toLocaleString(), inline: true },
                    { name: '帳號', value: `<@${interaction.user.id}>`, inline: true }
                )
                .setColor(0x00FF00)
                .setTimestamp()

            await interaction.editReply({ embeds: [embed], ephemeral: true })

            await client.db.set('verify', await client.db.get('verify').then(res => { return res.filter(arr => arr.ign != checkuser.ign) }))

        }
    }
}