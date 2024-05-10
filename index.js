const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const path = require('path');
const fs = require('fs');

const client = new Client({ intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]});
	
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: './database.sqlite' });
require('dotenv').config();

db.init();

console.log('\x1B[37m===============================================\x1B[0m')
//====================================

let c_count = 0;
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	console.log(`\x1B[30m┬──────────[${folder}]─────`)
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`\x1B[30m├─\x1B[32m成功載入 \x1B[34m指令:[${file}]\x1B[0m`)
			c_count++
		} else {
			console.log(`\─x1B[31m[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.\x1B[0m`);
		}
	}
}
console.log(`\x1B[37m-----------已成功載入[${c_count}]個指令-----------\x1B[0m`)

//====================================
client.db = db;

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
//====================================
const unityPath = path.join(__dirname, 'unity');
const unityFiles = fs.readdirSync(unityPath).filter(file => file.endsWith('.js'));

for (const file of unityFiles) {
	const filePath = path.join(unityPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
//=====================================
const buttonActions = {};
const ActionFolderPath = path.join(__dirname, '.', 'unity', 'action');
const actionFolders = fs.readdirSync(ActionFolderPath);

let a_count = 0;

for (const folder of actionFolders) {
	const actionPath = path.join(ActionFolderPath, folder);
	const actionFiles = fs.readdirSync(actionPath).filter(file => file.endsWith('.js'));
	console.log(`\x1B[30m┬──────────[${folder}]─────`)
	for (const file of actionFiles) {
		const filePath = path.join(actionPath, file);
		const action = require(filePath);
		if ('customId' in action && 'execute' in action) {
			buttonActions[action.customId] = action;
			console.log(`\x1B[30m├─\x1B[32m成功載入 \x1B[36m事件:[${file}]\x1B[0m`)
			a_count++
		} else {
			console.log(`\x1B[31m[WARNING] The action at ${filePath} is missing a required "customid" or "execute" property.`);
		}
	}
}
console.log(`\x1B[37m-----------已成功載入[${a_count}]個事件-----------\x1B[0m`)
console.log('\x1B[37m============================\x1B[0m')
//====================================
client.login(process.env.TOKEN);