const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const { AdminRoleId } = require('../../config.json')
const { GetUserMoney } = require('../../function/economy.js')
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('test command')
        .setDMPermission(false),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        }

        const commands = [];
        const foldersPath = path.join(__dirname, '../../commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                const filePath = path.join(commandsPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at "${filePath}" is missing a required "data" or "execute" property.`);
                }
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('command test')
        // .setDescription((await GetUserMoney('!')).toString())

        for (const command of commands) {
            embed.addFields({ name: command.name, value: '`'+command.description+'`', inline: true })
        }

        console.log(commands)

        

        await interaction.reply({ embeds: [embed], ephemeral: true })
    },
};