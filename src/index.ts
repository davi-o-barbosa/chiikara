import { Client, Intents, Collection, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { config } from 'dotenv'; config();
import { PrismaClient } from '@prisma/client';
import FastGlob from 'fast-glob';

export interface Command {
  data: SlashCommandBuilder,
  bot: boolean,
  mod: boolean,
  execute: (interaction: Interaction, prisma: PrismaClient) => Promise<void>
}

// Interface para armazenar dados importantes para o funcionamento do bot.
export interface Bot {
  client: Client<boolean>,
  commands: Collection<string, Command>,
  prisma: PrismaClient
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const commands = new Collection<string, Command>();
const prisma = new PrismaClient();

const bot: Bot = { client, commands, prisma };

const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
const cwd = process.env.NODE_ENV === 'production' ? 'build' : 'src';

const eventFiles = FastGlob.sync([`events/**.${fileExtension}`], { cwd });
eventFiles.forEach(async (file) => {
  const event = (await import('./' + file)).default;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, bot));
  }
  else {
    client.on(event.name, (...args) => event.execute(...args, bot));
  }
});

const commandFiles = FastGlob.sync([`commands/*/**.${fileExtension}`], { cwd });
commandFiles.forEach(async (file) => {
  const command = (await import('./' + file)).default;
  commands.set(command.data.name, command);
});

console.log('\x1b[1m\x1b[35m' + `Running in \x1b[32m${process.env.NODE_ENV} \x1b[0m`);
client.login(process.env.TOKEN);