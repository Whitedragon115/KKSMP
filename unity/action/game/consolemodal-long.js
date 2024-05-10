const { SlashCommandBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    customId: 'consolemodal-long',
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setTitle('Minecraft Console')
        .setCustomId('minecraft-console');

        const code = new TextInputBuilder()
        .setCustomId('command')
        .setRequired(true)
        .setLabel('say hello!hello!')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(2048)

        const password = new TextInputBuilder()
        .setCustomId('password')
        .setRequired(true)
        .setLabel('Password')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(256)

        const actionone = new ActionRowBuilder().addComponents(code)
        const actiontwo = new ActionRowBuilder().addComponents(password)

        modal.addComponents(actionone, actiontwo)
        interaction.showModal(modal)
    }
}