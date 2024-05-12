const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { SQLDatabase, SQLHost, SQLPassword, SQLPort, SQLUser } = require('./config.json')
const { QuickDB, MySQLDriver } = require("quick.db");
const { color, log } = require('console-log-colors')
const path = require('path');
const fs = require('fs');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});


(async () => {
	const mysqlDriver = new MySQLDriver({
		host: SQLHost,
		user: SQLUser,
		password: SQLPassword,
		database: SQLDatabase,
		port: SQLPort,
	});

	await mysqlDriver.connect();
	const db = new QuickDB({ driver: mysqlDriver });
	client.db = db;

})();

require('dotenv').config();



console.log(color.c255('══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════'))
//====================================

let commandCount = 0;
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const maxcommandLength = Math.max(...commandFolders.map(folder => folder.length)); // 获取最长文件夹名称的长度

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	let loadstring = "";
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			loadstring += color.gray('│ ') + color.blue(`[${file}] `);
			commandCount++;
		} else {
			console.log(`\─x1B[31m[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.\x1B[0m`);
		}
	}
	const folderNameSpaces = ' '.repeat(maxcommandLength - folder.length); // 计算需要添加的空格数量
	console.log(color.grey('⟐ ') + color.green('成功載入 ') + color.c75(`[${folder}]${folderNameSpaces} » `) + loadstring);
}

console.log(color.gray(`──────────────────────────────${color.gray(`┤             [成功載入${commandCount}個指令]`)}`))
//=====================================
const buttonActions = {};
const ActionFolderPath = path.join(__dirname, '.', 'util', 'action');
const actionFolders = fs.readdirSync(ActionFolderPath);
const maxActionLength = Math.max(...actionFolders.map(folder => folder.length));

let actionCount = 0;
for (const folder of actionFolders) {
	const actionPath = path.join(ActionFolderPath, folder);
	const actionFiles = fs.readdirSync(actionPath).filter(file => file.endsWith('.js'));
	let loadstring = "";
	for (const file of actionFiles) {
		const filePath = path.join(actionPath, file);
		const action = require(filePath);
		if ('customId' in action && 'execute' in action) {
			buttonActions[action.customId] = action;
			loadstring += color.gray('│ ') + color.cyan(`[${file}] `);
			actionCount++;
		} else {
			console.log(`\x1B[31m[WARNING] The action at ${filePath} is missing a required "customid" or "execute" property.`);
		}
	}
	const folderNameSpaces = ' '.repeat(maxActionLength - folder.length);
	console.log(color.grey('⟐ ') + color.green('成功載入 ') + color.c75(`[${folder}]${folderNameSpaces} » `) + loadstring);
}
console.log(color.gray(`══════════════════════════════${color.gray(`╧═════════════[成功載入${actionCount}個互動事件]`)}`))
//====================================

console.log(color.yellow('[載入Event中...]                            [載入Util中...]'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const eventsLoading = [];
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    const eventType = event.once ? '[\x1B[32mOnce\x1B[0m]' : '[\x1B[34mOn\x1B[0m]  ';
    eventsLoading.push(`${eventType.padEnd(10)} ${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

const utilPath = path.join(__dirname, 'util');
const utilFiles = fs.readdirSync(utilPath).filter(file => file.endsWith('.js'));

const utilsLoading = [];
for (const file of utilFiles) {
    const filePath = path.join(utilPath, file);
    const event = require(filePath);
    const eventType = event.once ? '[\x1B[32mOnce\x1B[0m]' : '[\x1B[34mOn\x1B[0m]';
    utilsLoading.push(`${eventType.padEnd(10)} ${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

const maxLines = Math.max(eventsLoading.length, utilsLoading.length);
for (let i = 0; i < maxLines; i++) {
    const eventLine = eventsLoading[i] || '';
    const utilLine = utilsLoading[i] || '';
    console.log(`${eventLine.padEnd(53)}${utilLine}`);
}

console.log(color.white('══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════'));
//====================================
client.login(process.env.TOKEN);