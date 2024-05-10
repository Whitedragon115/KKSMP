const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')

async function CreateConsolePanel(message, edit) {
    const row = new ActionRowBuilder()

    const btn = new ButtonBuilder()
        .setCustomId("consolemodal")
        .setLabel("指令編寫")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji({ name: "🎚️" })

    const btn2 = new ButtonBuilder()
        .setCustomId("consolemodal-long")
        .setLabel("長指令編寫")
        .setStyle(ButtonStyle.Danger)
        .setEmoji({ name: "🎛️" })

    row.addComponents(btn, btn2)

    const embed = new EmbedBuilder()
        .setColor(0x67c773)
        .setTitle("Minecraft Console")
        .setDescription("請輸入指令")
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
    CreateConsolePanel,
}