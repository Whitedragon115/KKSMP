const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { ButtonStyle, getInitialSendRateLimitState } = require('discord.js')
const { WhitelistConfirmChannel } = require('../../../config.json')
const { GetUUID  } = require('../../../function/minecraft.js')

module.exports = {
    customId: 'whitelist-modal',
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const ign = interaction.fields.getTextInputValue('gameid')?.replace(/\s/g, '').toLowerCase();
        const uuid = await GetUUID(ign)

        const getuserac = await client.db.get('Account').then(res => { return res.find(arr => arr.ign.some(id => id == uuid) == true) })
        const getuser = await client.db.get('Account').then(res => { return res.find(arr => arr.id == interaction.user.id) })

        if(!uuid) return interaction.editReply({ content: `找不到這個遊戲id`, ephemeral: true })
        if (getuserac) return interaction.editReply({ content: `遊戲帳號已被註冊`, ephemeral: true })
        if (getuser?.ign.length >= 3) return interaction.editReply({ content: `註冊過多帳號`, ephemeral: true })
        if(!/^[a-zA-Z0-9_]+$/.test(ign)) return interaction.editReply({ content: `遊戲id只能包含英文數字和底線`, ephemeral: true })

        if(getuser){
            const userindex = await client.db.get('Account').then(res => { return res.findIndex(arr => arr.id == interaction.user.id) })
            let getac = await client.db.get(`Account`).then(res => { return res })
            getac[userindex].ign = [...getac[userindex].ign, uuid]
            await client.db.set(`Account`, getac)
        }else{
            const newaccdata = {
                id: interaction.user.id,
                ign: [await GetUUID(ign)],
                ban: false
            }
            await client.db.push(`Account`, newaccdata)
        }

        const row = new ActionRowBuilder()
        const embed = new EmbedBuilder()
            .setTitle('白名單申請')
            .setDescription(`使用者 \`${interaction.user.tag}\` 想要註冊帳號`)
            .addFields(
                { name: '遊戲id', value: `\`${ign}\``, inline: true },
                { name: '這是他的第幾個帳號', value: `\`${getuserac?.ign.length ? getuserac.ign.length : 1}\``, inline: true },
                { name: '使用者id', value: `\`${interaction.user.id}\``, inline: true }
            )
            .setTimestamp()

        const button = new ButtonBuilder()
            .setCustomId('whitelist-confirm')
            .setLabel('確認')
            .setStyle(ButtonStyle.Success)

        row.addComponents(button)

        const channel = interaction.guild.channels.cache.get(WhitelistConfirmChannel)
        // await channel.send({ embeds: [embed], components: [row] })

        await interaction.editReply({ content: `已經把你的id \`${ign}\` 註冊了喔，請等待管理員驗證完後系統會自動通知你!~`, ephemeral: true })

    }
}