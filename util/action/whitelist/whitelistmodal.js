const { SlashCommandBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    customId: 'whitelist',
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setTitle('白名單申請')
        .setCustomId('whitelist-modal');

        const code = new TextInputBuilder()
        .setCustomId('gameid')
        .setRequired(true)
        .setLabel('寫上你的id吧')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(15)
        .setMinLength(3)

        const actionone = new ActionRowBuilder().addComponents(code)

        modal.addComponents(actionone)
        interaction.showModal(modal)
    }
}