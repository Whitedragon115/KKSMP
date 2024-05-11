const { Events, Client, GatewayIntentBits, Colors } = require('discord.js');
const { AdminRoleId, CommandChannel } = require('../config.json')
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {

		if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu()) return;
		const Action = {};

		const command = interaction.client.commands.get(interaction.commandName);
		const ActionFolderPath = path.join(__dirname, '..', 'util', 'action');
		const actionFolders = fs.readdirSync(ActionFolderPath);

		for (const folder of actionFolders) {
			const actionPath = path.join(ActionFolderPath, folder);
			const actionFiles = fs.readdirSync(actionPath).filter(file => file.endsWith('.js'));
			for (const file of actionFiles) {
				const filePath = path.join(actionPath, file);
				const action = require(filePath);
				Action[action.customId] = action;
			}
		}

		const action = Action[interaction.customId];

		if (action) {
			try {
				await action.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'An error occurred while handling this interaction.', ephemeral: true });
			}
		}

		if (command) {
			try {
				if(!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId) && interaction.channel.id != CommandChannel){
					return interaction.reply({ content: `請在<#${CommandChannel}>使用指令`, ephemeral: true })
				}

				if (interaction.isAutocomplete()) {
					await command.autocomplete(interaction, client);
				} else {
					await command.execute(interaction, client);
				}
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}

	},
};