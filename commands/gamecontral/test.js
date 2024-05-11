const { SlashCommandBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { AdminRoleId } = require('../../config.json')
const { GetUserMoney } = require('../../function/economy.js')
const path = require('path');
const fs = require('fs');
const { create, get } = require('sourcebin');
const { title } = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('test command')
        .setDMPermission(false),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        }

        const bindata = {
            title: 'my first bin',
            description: 'create at ' + new Date(),
            files: [{
                content: 'my sql database',
                languageId: 'sql',
            }]
        }

        const res = await create(bindata)
        console.log(res)


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test')
                    .setLabel('test')
                    .setStyle(ButtonStyle.Danger)
            )

        const embed = new EmbedBuilder()
            .setTitle('command test')
        // const commands = [];
        // const foldersPath = path.join(__dirname, '../../commands');
        // const commandFolders = fs.readdirSync(foldersPath);

        // for (const folder of commandFolders) {
        //     const commandsPath = path.join(foldersPath, folder);
        //     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        //     for (const file of commandFiles) {

        //         const filePath = path.join(commandsPath, file);
        //         const command = require(filePath);

        //         if ('data' in command && 'execute' in command) {
        //             commands.push(command.data.toJSON());
        //         } else {
        //             console.log(`[WARNING] The command at "${filePath}" is missing a required "data" or "execute" property.`);
        //         }
        //     }
        // }
        // .setDescription((await GetUserMoney('!')).toString())

        // for (const command of commands) {
        //     embed.addFields({ name: command.name, value: '`'+command.description+'`', inline: true })
        // }

        // console.log(commands)


        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

        // await interaction.followUp({ content: 'test', ephemeral: true })
        // const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15_000 });

        // collector.on('collect', i => {
        //     if (i.user.id === interaction.user.id) {
        //         i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
        //     } else {
        //         i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
        //     }
        // });

        // collector.on('end', collected => {
        //     console.log(`Collected ${collected.size} interactions.`);
        //     console.log(collected)
        // });
    },
};