import { Interaction } from 'discord.js';
import { Bot } from '..';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: Interaction, { commands, prisma }: Bot): Promise<void> {
    if (!interaction.isCommand() || !commands.has(interaction.commandName)) return;
    if (!interaction.guildId) return await interaction.reply({ content: 'Por favor, use meus comandos dentro de servidores.' });

    const guildBotChannels = await prisma.guildBotChannels.findMany({
      where: { guildId: interaction.guild?.id },
    });

    try {
      const command = commands.get(interaction.commandName);
      if (!command) return;

      if (command.bot && guildBotChannels.length > 0 && !guildBotChannels.find(obj => obj.channelId === interaction?.channel?.id)) {
        return await interaction.reply({ content: 'Você só pode usar esse comando no canal de bots.', ephemeral: true });
      }

      await command.execute(interaction, prisma);
    }
    catch (e) {
      console.error(e);
      await interaction.reply({
        content: 'Houve um erro inesperado ao executar o seu comando.',
        ephemeral: true,
      });
    }
  },
};