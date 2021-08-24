import { Client, Intents, Collection, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { config } from 'dotenv'; config();
import FastGlob from 'fast-glob';

// Interface para comandos.
export interface Command {
	data: SlashCommandBuilder
	execute: (interaction: Interaction) => Promise<void>
}

// Interface para armazenar dados importantes para o funcionamento do bot.
export interface Bot {
	client: Client<boolean>,
	commands: Collection<string, Command>
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const commands = new Collection<string, Command>();
const bot: Bot = { client, commands };

const eventFiles = FastGlob.sync(['events/**.ts'], { cwd: 'src' });
eventFiles.forEach(async (file) => {
	const event = (await import('./' + file)).default;
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, bot));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, bot));
	}
});

const commandFiles = FastGlob.sync(['commands/**/**.ts'], { cwd: 'src' });
commandFiles.forEach(async (file) => {
	const command = (await import('./' + file)).default;
	commands.set(command.data.name, command);
});

client.login(process.env.TOKEN);