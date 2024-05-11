const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
const { AdminRoleId } = require('../../config.json')
const { create, get } = require('sourcebin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sql-edit')
        .setDescription('Edit SQL data')
        .setDMPermission(false)
    ,

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        }

        await interaction.deferReply({ ephemeral: true });

        const data = await client.db.all();
        if (!data) return interaction.editReply({ content: 'No data found', ephemeral: true })

        const bindata = {
            title: 'SQL EDIT',
            description: 'create at ' + new Date(),
            files: [{
                content: JSON.stringify(data, null, 2),
                languageId: 'json',
            }]
        }

        const res = await create(bindata)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sql-edit-done')
                    .setLabel('Done')
                    .setStyle(ButtonStyle.Danger)
            )

        await interaction.editReply({ content: `## 點我編輯SQL資料庫 [編輯我!](<${res.url}>)`, components: [row] });

    },
};