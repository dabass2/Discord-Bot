const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../botconfig.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here

const clientId = '500122158039826433';
const guildId = '500122804520353799'; // dev
// const guildId = '110419059232780288'; // prod

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
    console.log(command)
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();