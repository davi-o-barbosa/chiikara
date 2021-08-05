import { Client, Intents } from 'discord.js';

import { config } from 'dotenv';
config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.ts'));

client.login(process.env.TOKEN);