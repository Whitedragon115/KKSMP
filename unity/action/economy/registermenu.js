const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { GetIGN } = require('../../../function/minecraft.js')

module.exports = {
    customId: 'economy',
    async execute(interaction, client) {
        const getuser = await client.db.get('Account').then(res => { return res.find(arr => arr.id == interaction.user.id) })
        const checkuserregister = await client.db.get('economy').then(res => { return res?.find(arr => arr.id == interaction.user.id) })

        //array structure
        if (checkuserregister) return interaction.reply({ content: `**你已經註冊過經濟帳號了**`, ephemeral: true })
        if (!getuser?.ign) return interaction.reply({ content: `**請先註冊遊戲帳號在註冊經濟帳號喔**`, ephemeral: true })
        if (getuser.ban) return interaction.reply({ content: `**你已被封鎖，無法使用此功能**`, ephemeral: true })

        const row = new ActionRowBuilder()
        const menu = new StringSelectMenuBuilder()
            .setCustomId('economy-select')
            .setPlaceholder('選擇你的遊戲帳號註冊')

        for (let i = 0; i < getuser.ign.length; i++) {
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(await GetIGN(getuser.ign[i]))
                .setValue(getuser.ign[i])
            menu.addOptions(option)
        }

        row.addComponents(menu)

        await interaction.reply({ content: `**請選擇你要註冊的遊戲帳號**`, components: [row], ephemeral: true })

    }
}