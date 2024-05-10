const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders')
const { ButtonStyle, ApplicationCommandPermissionType } = require('discord.js')
const { GetUUID } = require('../../../function/minecraft.js')
const { create } = require('discord-timestamps')
const { SendCommand } = require('../../../function/rcon.js')

const CoolDown = [];

module.exports = {
    customId: 'economy-register',
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })
        if(CoolDown.some(arr => arr == interaction.user.id)) return interaction.editReply({ content: `**你已經在驗證中了，請等待驗證完成後再試**`, ephemeral: true })

        const regex = /`(.*?)`/;
        const registerign = interaction.message.embeds[0].description.match(regex)[1]
        const registerignuuid = await GetUUID(registerign)

        const checkaccountregister = await client.db.get('economy').then(res => { return res?.find(arr => arr.ign == registerignuuid) })
        const checkuserregister = await client.db.get('economy').then(res => { return res?.find(arr => arr.id == interaction.user.id) })

        if (checkaccountregister) return interaction.editReply({ content: `**遊戲帳號 [\`${registerign}\`] 已經註冊過了**`, ephemeral: true })
        if (checkuserregister) return interaction.editReply({ content: `**你已經註冊過經濟帳號了**`, ephemeral: true })

        const verifycode = generateVerifyCode()
        const command = `tellraw ${registerign} ["",{"text":"[","color":"gray"},{"text":"\u7d93\u6fdf\u9a57\u8b49","color":"yellow"},{"text":"] ","color":"gray"},{"text":"»","color":"dark_gray"},{"text":" Hey \u807d\u8aaa\u4f60\u8981\u9a57\u8b49\u55ce\uff0c\u9019\u662f\u4f60\u7684\u9a57\u8b49\u78bc "},{"text":"<","color":"blue"},{"text":"${verifycode}","color":"aqua"},{"text":">","color":"blue"}]`
        await SendCommand(command)

        const embed = new EmbedBuilder()
            .setTitle('遊戲驗證')
            .setDescription(`接下來要請你驗證遊戲帳號，我們會發送一個驗證碼到你的遊戲帳號，所以請確認你的遊戲經濟帳號已登入在遊戲中...
            **你只能每兩分鐘驗證一次，請確認網路狀況穩定，避免驗證失敗**

            > 當你準備好後就可以點擊下方按鈕來輸入驗證馬，你只有${await create(120, "RELATIVE")}的時間來完成驗證`)

        const row = new ActionRowBuilder()
        const button = new ButtonBuilder()
            .setCustomId('economy-verify')
            .setLabel('輸入驗證碼')
            .setStyle(ButtonStyle.Primary)
            .setEmoji({ name: '✅' })
            .setDisabled(false)
        row.addComponents(button)

        await client.db.push('verify', { id: interaction.user.id, code: verifycode, ign: registerign })
        await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true })
        CoolDown.push(interaction.user.id)

        console.log(verifycode)

        return setTimeout(async () => {
            await client.db.set('verify', await client.db.get('verify').then(res => { return res.filter(arr => arr.ign != registerign) }))
            CoolDown.pop(interaction.user.id)

            const row = new ActionRowBuilder()
            const button = new ButtonBuilder()
                .setLabel("驗證時間已過期")
                .setCustomId('verify-expired')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
            row.addComponents(button)

            await interaction.editReply({ content: `## 驗證時間已過，請重新註冊一次`, components: [row], embeds: [], ephemeral: true })
        }, 120 * 1000);

    }
}

function generateVerifyCode() {
    return Math.floor(Math.random() * 900000) + 100000;
}