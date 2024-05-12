const { SlashCommandBuilder, ButtonStyle } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
const { data } = require('../economy-player/pay')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notifypanel')
        .setDescription('Notify Panel'),

    async execute(interaction, client) {

        const row1 = new ActionRowBuilder()
        const row2 = new ActionRowBuilder()
        const row3 = new ActionRowBuilder()

        const economy = new ButtonBuilder()
            .setCustomId('economy-notify')
            .setLabel("所有的經濟通知")
            .setStyle(ButtonStyle.Success)
            .setEmoji({ name: "💳" })

        const economy_pay = new ButtonBuilder()
            .setCustomId('economy-pay-notify')
            .setLabel("經濟轉帳通知")
            .setStyle(ButtonStyle.Success)
            .setEmoji({ name: "🪙" })

        const economy_shop = new ButtonBuilder()
            .setCustomId('economy-shop-notify')
            .setLabel("商店購買通知")
            .setStyle(ButtonStyle.Success)
            .setEmoji({ name: "🛒" })

        const economy_lottery = new ButtonBuilder()
            .setCustomId('economy-lottery-notify')
            .setLabel("彩票通知")
            .setStyle(ButtonStyle.Success)
            .setEmoji({ name: "🎰" })



    }
}