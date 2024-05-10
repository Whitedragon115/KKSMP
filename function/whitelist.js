const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')

async function CreateWhitelistPanel(message, edit) {
    const row = new ActionRowBuilder()

    const btn = new ButtonBuilder()
        .setCustomId("whitelist")
        .setLabel("白名單申請")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({ name: "📀" })

    row.addComponents(btn)

    const embed = new EmbedBuilder()
        .setColor(0x67c773)
        .setTitle("申請白名單")
        .setDescription("### 點及按鈕填寫表單，稍微等待後系統就會自動把你加入白名單了喔\n> 一個人只能最多申請三個帳號，如果需要更多帳號並且有合理需求可以開單說明\n\n*如果有遇到系統當機請直接開單*")
        .setTimestamp()

    if (edit) {
        const newmsg = await message.channel.messages.fetch(message.reference.messageId)
        if (!newmsg.author.bot) {
            const errmsg = message.reply("No message found")
            errmsg.then(errmsg => setTimeout(() => {
                errmsg.delete()
                message.delete()
            }, 5000));
            return;
        };
        await newmsg.edit({ embeds: [embed], components: [row] })
        message.delete()
        return;
    }

    message.channel.send({ embeds: [embed], components: [row] })
    message.delete()
}



module.exports = {
    CreateWhitelistPanel,
}