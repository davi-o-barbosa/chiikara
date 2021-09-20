import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv'; config();
import { Command } from './index';
import FastGlob from 'fast-glob';

async function prepareCommands(): Promise<Array<Command>> {
  const commandFiles = await FastGlob(['commands/*/**.ts'], { cwd: 'src' });
  const commands: Command[] = [];

  for (const file of commandFiles) {
    const importedCommand = (await import('./' + file)).default;
    commands.push(importedCommand.data.toJSON());
  }

  return commands;
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN as string);

(async () => {
  const args = process.argv[2];
  try {
    if (!args) {
      const commands = await prepareCommands();
      console.log('\n[1] Realizando deploy no servidor de testes.');
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENTID as `${bigint}`, process.env.DEVGUILDID as `${bigint}`),
        { body: commands },
      );
    }
    else if (args == '-clear') {
      console.log('\n[1] Limpando todos os comandos registrados no servidor de testes.');
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENTID as `${bigint}`, process.env.DEVGUILDID as `${bigint}`),
        { body: [] },
      );
    }
    else if (args == '-global') {
      const commands = await prepareCommands();
      console.log('\n[1] Realizando deploy Global.');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENTID as `${bigint}`),
        { body: commands },
      );
    }
    else if (args == '-clearGlobal') {
      console.log('\n[1] Limpando deploy global.');
      await rest.put(
        Routes.applicationCommands(process.env.CLIENTID as `${bigint}`),
        { body: [] },
      );
    }
    console.log('[2] Executado com sucesso.\n');
  }
  catch (error) {
    console.error(error);
  }
})();
