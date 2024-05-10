const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')
const { SendResponseCommand, SendCommand } = require('./rcon.js')

async function CreateEconomyRegisterPanel(message, edit) {

    const row = new ActionRowBuilder()
    const btn = new ButtonBuilder()
        .setCustomId('economy')
        .setLabel("註冊")
        .setStyle(ButtonStyle.Success)
        .setEmoji({ name: "💳" })

    row.addComponents(btn)

    const embed = new EmbedBuilder()
        .setColor(0x67c773)
        .setTitle("註冊經濟帳號")
        .setDescription("### 點及按鈕就可以註冊你的經濟帳號了\n> 經濟帳號每個使用者只能註冊一次，並且只能綁定一個帳號，註冊完綁定後就無法更改\n~~---------~~\n> 如果要註冊帳號必須讓帳號在線上才行，因為要進行身分驗證\n\n*如果有遇到系統當機請直接開單*")
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


async function GetUserMoney(ign) {
    const res = await SendResponseCommand(`bal ${ign}`)
    if (res.includes('Rcon連接失敗')) return res
    if (res.includes('不存在') || res.includes("Invalid command argument")) return "玩家沒有註冊帳號"
    const money = parseFloat([...res.matchAll(/\[(.*?)\]/g)][1][1].match(/§d([\d,.]+)§x/)[1].replace(/,/g, ''));
    return money
}

async function GiveUserMoney(ign, money) {
    const res = await SendResponseCommand(`eco add ${ign} ${money}`)
    return res
}

async function TakeUserMoney(ign, money) {
    const res = await SendResponseCommand(`eco withdraw ${ign} ${money}`)
    return res
}

async function SetUserMoney(ign, money) {
    const res = await SendResponseCommand(`eco set ${ign} ${money}`)
    return res
}


module.exports = {
    CreateEconomyRegisterPanel,
    GetUserMoney,
    GiveUserMoney,
    TakeUserMoney,
    SetUserMoney
}